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
int window_width = 800, window_height = 800;

void display();
float random_float(float min, float max);
void create_random_lights();

#if MODE != FORWARD
unsigned int g_buffer, g_position, g_normal, g_albedo_spec;
GLuint h_ShaderProgram_mrt, h_ShaderProgram_deferred;
GLint loc_material_idx;
loc_Material_Parameters loc_materials[NUMBER_OF_MATERIAL_SUPPORTED];

void create_G_buffer();
void prepare_shader_deferred();
void prepare_materials();

void draw_quad();
#endif