cmake_minimum_required(VERSION 3.15)
if(COMMAND cmake_policy)
  cmake_policy(SET CMP0003 NEW)
endif(COMMAND cmake_policy)

# MSVC runtime library flags are selected by an abstraction.
if(COMMAND cmake_policy AND POLICY CMP0091)
  cmake_policy(SET CMP0091 NEW)
endif()

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(protobuf_BUILD_TESTS OFF CACHE BOOL "Build protobuf tests")
set(protobuf_WITH_ZLIB OFF CACHE BOOL "Build protobuf with zlib.")
set(PROTOBUF_ROOT_DIR ${CMAKE_CURRENT_SOURCE_DIR}/deps/protobuf)
add_subdirectory(${PROTOBUF_ROOT_DIR}/cmake deps/protobuf)

set(CMAKE_EXE_LINKER_FLAGS "-static-libstdc++")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fno-stack-protector")

add_executable(grpc_node_plugin
  src/node_generator.cc
  src/node_plugin.cc
)

if (MSVC)
  set(CMAKE_MSVC_RUNTIME_LIBRARY MultiThreaded$<$<CONFIG:Debug>:Debug>)
endif (MSVC)

target_include_directories(grpc_node_plugin
  PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}
  PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src
  PRIVATE ${PROTOBUF_ROOT_DIR}/include
)

target_link_libraries(grpc_node_plugin
  libprotoc
  libprotobuf
)
