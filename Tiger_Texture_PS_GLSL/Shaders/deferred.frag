#version 430

out vec4 final_color;

in vec2 tex_coords;

uniform sampler2D g_position;
uniform sampler2D g_normal;
uniform sampler2D g_albedo_spec;

struct LIGHT {
	vec4 position; // assume point or direction in EC in this example shader
	vec4 ambient_color, diffuse_color, specular_color;
	vec4 light_attenuation_factors; // compute this effect only if .w != 0.0f
	vec3 spot_direction;
	float spot_exponent;
	float spot_cutoff_angle;
	bool light_on;
};

struct MATERIAL {
	vec4 ambient_color;
	vec4 diffuse_color;
	vec4 specular_color;
	vec4 emissive_color;
	float specular_exponent;
};

uniform vec4 u_global_ambient_color;
#define NUMBER_OF_LIGHTS_SUPPORTED 100
#define NUMBER_OF_MATERIAL_SUPPORTED 2
uniform LIGHT u_light[NUMBER_OF_LIGHTS_SUPPORTED];
uniform MATERIAL u_material[NUMBER_OF_MATERIAL_SUPPORTED];

const float zero_f = 0.0f;
const float one_f = 1.0f;

vec4 lighting_equation_textured(in vec3 P_EC, in vec3 N_EC, in vec4 base_color, in int mat_idx) {
	vec4 color_sum;
	float local_scale_factor, tmp_float; 
	vec3 L_EC;
	MATERIAL mat = u_material[mat_idx];

	color_sum = mat.emissive_color + u_global_ambient_color * base_color;
 
	for (int i = 0; i < NUMBER_OF_LIGHTS_SUPPORTED; i++) {
		if (!u_light[i].light_on) continue;

		local_scale_factor = one_f;
		if (u_light[i].position.w != zero_f) { // point light source
			L_EC = u_light[i].position.xyz - P_EC.xyz;

			if (u_light[i].light_attenuation_factors.w  != zero_f) {
				vec4 tmp_vec4;

				tmp_vec4.x = one_f;
				tmp_vec4.z = dot(L_EC, L_EC);
				tmp_vec4.y = sqrt(tmp_vec4.z);
				tmp_vec4.w = zero_f;
				local_scale_factor = one_f/dot(tmp_vec4, u_light[i].light_attenuation_factors);
			}

			L_EC = normalize(L_EC);

			if (u_light[i].spot_cutoff_angle < 180.0f) { // [0.0f, 90.0f] or 180.0f
				float spot_cutoff_angle = clamp(u_light[i].spot_cutoff_angle, zero_f, 90.0f);
				vec3 spot_dir = normalize(u_light[i].spot_direction);

				tmp_float = dot(-L_EC, spot_dir);
				if (tmp_float >= cos(radians(spot_cutoff_angle))) {
					tmp_float = pow(tmp_float, u_light[i].spot_exponent);
				}
				else 
					tmp_float = zero_f;
				local_scale_factor *= tmp_float;
			}
		}
		else {  // directional light source
			L_EC = normalize(u_light[i].position.xyz);
		}	

		if (local_scale_factor > zero_f) {				
		 	vec4 local_color_sum = u_light[i].ambient_color * mat.ambient_color;

			tmp_float = dot(N_EC, L_EC);  
			if (tmp_float > zero_f) {  
				local_color_sum += u_light[i].diffuse_color*base_color*tmp_float;
			
				vec3 H_EC = normalize(L_EC - normalize(P_EC));
				tmp_float = dot(N_EC, H_EC); 
				if (tmp_float > zero_f) {
					local_color_sum += u_light[i].specular_color
				                       *mat.specular_color*pow(tmp_float, mat.specular_exponent);
				}
			}
			color_sum += local_scale_factor*local_color_sum;
		}
	}
 	return color_sum;
}

void main() {
	vec3 P_EC = texture(g_position, tex_coords).rgb;
	vec3 N_EC = texture(g_normal, tex_coords).rgb;
	vec4 diffuse = vec4(texture(g_albedo_spec, tex_coords).rgb, 1.0f);
	int mat_idx = int(texture(g_albedo_spec, tex_coords).a * 10 + 0.1);

	final_color = lighting_equation_textured(P_EC, normalize(N_EC), diffuse, mat_idx);
}