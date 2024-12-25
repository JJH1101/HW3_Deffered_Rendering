#pragma once

#define FORWARD 0
#define DEFERRED 1
#define DEFERRED_RANGE 2
#define DEFERRED_STENCIL 3

#define MODE DEFERRED

#define NUMBER_OF_LIGHT_SUPPORTED 100
#define NUMBER_OF_MATERIAL_SUPPORTED 2

#define LIGHT_ATTENUATION_CONSTANT 1.0f
#define LIGHT_ATTENUATION_LINEAR 0.007f
#define LIGHT_ATTENUATION_QUADRATIC 0.0002f

#include <GL/glew.h>
#include "My_Shading.h"
#include "wglext.h"

int window_width = 800, window_height = 800;
float global_ambient[] = {0.115f, 0.115f, 0.115f, 1.0f};

void display();
float random_float(float min, float max);
void create_random_lights();

GLuint sphereVAO, sphereVBO;
int n_triangles_sphere;

void prepare_sphere();
void draw_sphere();
void draw_spheres();

int previousTime = 0, frameCount = 0;
double fps = 0.0;

void idle();
void setVSync(int interval);

#if MODE != FORWARD
unsigned int g_buffer, g_position, g_normal, g_albedo_spec, g_rbo_depth;
GLuint h_ShaderProgram_mrt, h_ShaderProgram_deferred;
GLint loc_material_idx;
loc_Material_Parameters loc_materials[NUMBER_OF_MATERIAL_SUPPORTED];

float quadVertices[] = {
	// positions        // texture Coords
	-1.0f,  1.0f, 0.0f, 0.0f, 1.0f,
	-1.0f, -1.0f, 0.0f, 0.0f, 0.0f,
	 1.0f,  1.0f, 0.0f, 1.0f, 1.0f,
	 1.0f, -1.0f, 0.0f, 1.0f, 0.0f,
};
GLuint quadVAO, quadVBO;

void create_G_buffer();
void delete_G_buffer();
void prepare_shader_deferred();
void prepare_materials();

void prepare_quad();
void draw_quad();

void cleanup_deferred();

#if MODE == DEFERRED_STENCIL
unsigned int g_final, g_depth_stencil;
GLint loc_ModelViewProjectionMatrix_sphere, loc_ModelViewProjectionMatrix_deferred, loc_light_idx, loc_window_size;
GLuint h_ShaderProgram_stencil, h_ShaderProgram_ambient;
GLint loc_emissive_color[NUMBER_OF_MATERIAL_SUPPORTED];

void geometry_pass();
void stencil_pass(unsigned int light_idx);
void lighting_pass(unsigned int light_idx);
void ambient_pass();
void final_pass();
#endif
#endif