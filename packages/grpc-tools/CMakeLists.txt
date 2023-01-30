CMAKE_MINIMUM_REQUIRED(VERSION 3.7)
PROJECT("grpc-tools")

SET(CMAKE_OSX_DEPLOYMENT_TARGET "11.7" CACHE STRING "Minimum OS X deployment version" FORCE)

IF(COMMAND CMAKE_POLICY)
    CMAKE_POLICY(SET CMP0003 NEW)
ENDIF(COMMAND CMAKE_POLICY)

# MSVC runtime library flags are selected by an abstraction.
IF(COMMAND CMAKE_POLICY AND POLICY CMP0091)
    CMAKE_POLICY(SET CMP0091 NEW)
ENDIF()

SET(CMAKE_CXX_STANDARD 11)
SET(CMAKE_CXX_STANDARD_REQUIRED ON)
SET(CMAKE_CXX_EXTENSIONS OFF)

SET(protobuf_BUILD_TESTS OFF CACHE BOOL "Build protobuf tests")
SET(protobuf_WITH_ZLIB OFF CACHE BOOL "Build protobuf with zlib.")
SET(PROTOBUF_ROOT_DIR ${CMAKE_CURRENT_SOURCE_DIR}/deps/protobuf)

ADD_SUBDIRECTORY(${PROTOBUF_ROOT_DIR}/cmake deps/protobuf)

SET(CMAKE_EXE_LINKER_FLAGS "-static-libstdc++")
SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fno-stack-protector")

ADD_EXECUTABLE(grpc_node_plugin
    src/node_generator.cc
    src/node_plugin.cc
)

IF(MSVC)
    IF(CMAKE_VERSION VERSION_GREATER_EQUAL 3.15)
        SET(CMAKE_MSVC_RUNTIME_LIBRARY MultiThreaded$<$<CONFIG:Debug>:Debug>)
    ELSE()
        FOREACH(flag_var
            CMAKE_CXX_FLAGS
            CMAKE_CXX_FLAGS_DEBUG
            CMAKE_CXX_FLAGS_RELEASE
            CMAKE_CXX_FLAGS_MINSIZEREL
            CMAKE_CXX_FLAGS_RELWITHDEBINFO
        )
            IF(${flag_var} MATCHES "/MD")
                STRING(REGEX REPLACE "/MD" "/MT" ${flag_var} "${${flag_var}}")
            ENDIF(${flag_var} MATCHES "/MD")
        ENDFOREACH(flag_var)
    ENDIF()
ENDIF(MSVC)

TARGET_INCLUDE_DIRECTORIES(grpc_node_plugin
  PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}
  PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src
  PRIVATE ${PROTOBUF_ROOT_DIR}/include
)

TARGET_LINK_LIBRARIES(grpc_node_plugin
  libprotoc
  libprotobuf
)
