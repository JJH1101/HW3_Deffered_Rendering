#version 430

layout (location = 0) out vec3 g_position;
layout (location = 1) out vec3 g_normal;
layout (location = 2) out vec4 g_albedo_spec;

in vec3 v_position_EC;
in vec3 v_normal_EC;
in vec2 v_tex_coord;

uniform int u_material_idx;
uniform sampler2D u_base_texture;

void main() {
	g_position = v_position_EC;
	g_normal = v_normal_EC;
	g_albedo_spec.rgb = texture(u_base_texture, v_tex_coord).rgb;
	g_albedo_spec.a = u_material_idx * 0.1f;
}