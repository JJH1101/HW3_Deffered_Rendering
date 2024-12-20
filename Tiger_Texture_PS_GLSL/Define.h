#pragma once
#include <GL/glew.h>

#define FORWARD 0
#define DEFERRED 1
#define DEFERRED_RANGE 2
#define DEFERRED_STENCIL 3

#define MODE DEFERRED

#define NUMBER_OF_LIGHT_SUPPORTED 4 

int window_width = 800, window_height = 800;
unsigned int g_buffer, g_position, g_normal, g_albedo_spec;
GLuint h_ShaderProgram_mrt, h_ShaderProgram_deferred;

void create_G_buffer();
void prepare_shader_deferred();
void display();