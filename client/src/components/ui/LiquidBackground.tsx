import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;

// Noise function for terrain displacement
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.4142135623730950488016887242097;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

float terrain(vec2 p, float t) {
  float h = 0.0;
  // Slow rolling waves/dunes
  h += snoise(vec3(p * 0.2, t * 0.1)) * 2.5;
  h += snoise(vec3(p * 0.6 + vec2(t * 0.2), t * 0.15)) * 0.8;
  h += snoise(vec3(p * 1.5 - vec2(0.0, t * 0.3), t * 0.2)) * 0.3;
  return h;
}

void main() {
  vUv = uv;
  vec3 pos = position;
  
  float t = uTime * 0.5;
  
  // Apply terrain displacement
  pos.z += terrain(pos.xy, t);
  vPosition = pos;
  
  // Calculate exact normals for crisp lighting
  float e = 0.05;
  vec3 p1 = pos + vec3(e, 0.0, terrain(pos.xy + vec2(e, 0.0), t) - terrain(pos.xy, t));
  vec3 p2 = pos + vec3(0.0, e, terrain(pos.xy + vec2(0.0, e), t) - terrain(pos.xy, t));
  vNormal = normalize(cross(p1 - pos, p2 - pos));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  // Lighting setup - soft top-down light and warm rim light
  vec3 mainLight = normalize(vec3(0.5, 0.8, 1.0));
  vec3 rimLight = normalize(vec3(-1.0, -0.5, 0.5));
  vec3 viewDir = normalize(vec3(0.0, -1.0, 1.0));
  
  // Base earth/moss colors
  vec3 deepWater = vec3(0.06, 0.08, 0.07); // Very dark moss green/slate
  vec3 highlight = vec3(0.2, 0.3, 0.25); // Lighter moss/stone
  
  // Diffuse
  float diff = max(dot(vNormal, mainLight), 0.0);
  // Soft wrapped diffuse for natural look
  float wrapDiff = max(0.0, (dot(vNormal, mainLight) + 0.5) / 1.5);
  
  // Rim lighting (sunlight hitting ridges)
  float rim = max(dot(vNormal, rimLight), 0.0);
  rim = smoothstep(0.4, 1.0, rim);
  
  // Specular reflection (liquid/wet stone)
  vec3 halfVec = normalize(mainLight + viewDir);
  float spec = pow(max(dot(vNormal, halfVec), 0.0), 64.0);
  
  // Combine colors
  vec3 color = mix(deepWater, highlight, wrapDiff * 0.5);
  
  // Add sunlit sand/lichen accents on ridges
  vec3 accentColor = vec3(0.7, 0.8, 0.5); // Warm greenish-yellow
  color += accentColor * rim * 0.4;
  
  // Add specular highlights
  color += vec3(0.8, 0.9, 0.8) * spec * 0.3;
  
  // Depth fade / Vignette
  float dist = length(vPosition.xy);
  float fade = smoothstep(25.0, 5.0, dist);
  color *= fade;

  gl_FragColor = vec4(color, 1.0);
}
`

export function LiquidBackground() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef} position={[0, -2, -8]} rotation={[-Math.PI / 3, 0, 0]}>
      {/* High segment count for smooth terrain displacement */}
      <planeGeometry args={[60, 60, 256, 256]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        depthWrite={false}
        transparent={true}
      />
    </mesh>
  )
}


