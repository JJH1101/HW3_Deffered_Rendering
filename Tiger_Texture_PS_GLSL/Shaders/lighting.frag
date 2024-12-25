#version 430

out vec4 final_color;

uniform sampler2D g_position;
uniform sampler2D g_normal;
uniform sampler2D g_albedo_spec;

struct LIGHT {
	vec4 position; // assume point or direction in EC in this example shader
	vec4 ambient_color, diffuse_color, specular_color;
	vec4 light_attenuation_factors; // compute this effect only if .w != 0.0f
	bool light_on;
};

struct MATERIAL {
	vec4 ambient_color;
	vec4 diffuse_color;
	vec4 specular_color;
	vec4 emissive_color;
	float specular_exponent;
};

#define NUMBER_OF_LIGHTS_SUPPORTED 100
#define NUMBER_OF_MATERIAL_SUPPORTED 2
uniform int u_light_idx;
uniform LIGHT u_light[NUMBER_OF_LIGHTS_SUPPORTED];
uniform MATERIAL u_material[NUMBER_OF_MATERIAL_SUPPORTED];
uniform vec2 u_window_size;

const float zero_f = 0.0f;
const float one_f = 1.0f;

vec4 lighting_equation_textured(in vec3 P_EC, in vec3 N_EC, in vec4 base_color, in int mat_idx) {
	vec4 color_sum = vec4(0, 0, 0, 1);
	float local_scale_factor, tmp_float; 
	vec3 L_EC;

	MATERIAL mat = u_material[mat_idx];
 
	LIGHT light = u_light[u_light_idx];
	if (!light.light_on) return color_sum;

	local_scale_factor = one_f;
	if (light.position.w != zero_f) { // point light source
		L_EC = light.position.xyz - P_EC.xyz;

		if (light.light_attenuation_factors.w  != zero_f) {
			vec4 tmp_vec4;

			tmp_vec4.x = one_f;
			tmp_vec4.z = dot(L_EC, L_EC);
			tmp_vec4.y = sqrt(tmp_vec4.z);
			tmp_vec4.w = zero_f;
			local_scale_factor = one_f/dot(tmp_vec4, light.light_attenuation_factors);
		}

		L_EC = normalize(L_EC);
	}
	else {  // directional light source
		L_EC = normalize(light.position.xyz);
	}	
	if (local_scale_factor > zero_f) {				
	 	vec4 local_color_sum = light.ambient_color * mat.ambient_color;

		tmp_float = dot(N_EC, L_EC);  
		if (tmp_float > zero_f) {  
			local_color_sum += light.diffuse_color*base_color*tmp_float;
		
			vec3 H_EC = normalize(L_EC - normalize(P_EC));
			tmp_float = dot(N_EC, H_EC); 
			if (tmp_float > zero_f) {
				local_color_sum += light.specular_color
		                       *mat.specular_color*pow(tmp_float, mat.specular_exponent);
			}
		}
		color_sum += local_scale_factor*local_color_sum;
	}

 	return color_sum;
}

void main() {
	vec2 tex_coords = gl_FragCoord.xy / u_window_size;
	vec3 P_EC = texture(g_position, tex_coords).rgb;
	vec3 N_EC = texture(g_normal, tex_coords).rgb;
	vec4 diffuse = vec4(texture(g_albedo_spec, tex_coords).rgb, 1.0f);
	int mat_idx = int(texture(g_albedo_spec, tex_coords).a * 10 + 0.1f);

	final_color = lighting_equation_textured(P_EC, normalize(N_EC), diffuse, mat_idx);
}