# GRPC Node gyp file
# This currently builds the Node extension and dependencies
# This file has been automatically generated from a template file.
# Please look at the templates directory instead.
# This file can be regenerated from the template by running
# tools/buildgen/generate_projects.sh

# Copyright 2015 gRPC authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Some of this file is built with the help of
# https://n8.io/converting-a-c-library-to-gyp/
{
  'variables': {
    'runtime%': 'node',
    # Some Node installations use the system installation of OpenSSL, and on
    # some systems, the system OpenSSL still does not have ALPN support. This
    # will let users recompile gRPC to work without ALPN.
    'grpc_alpn%': 'true',
    # Indicates that the library should be built with gcov.
    'grpc_gcov%': 'false',
    # Indicates that the library should be built with compatibility for musl
    # libc, so that it can run on Alpine Linux. This is only necessary if not
    # building on Alpine Linux
    'grpc_alpine%': 'false'
  },
  'target_defaults': {
    'configurations': {
      'Release': {
        'cflags': [
            '-O2',
            '-Wframe-larger-than=16384',
        ],
        'defines': [
            'NDEBUG',
        ],
      },
      'Debug': {
        'cflags': [
            '-O0',
        ],
        'defines': [
            '_DEBUG',
            'DEBUG',
        ],
      },
    },
    'cflags': [
        '-g',
        '-Wall',
        '-Wextra',
        '-DOSATOMIC_USE_INLINED=1',
        '-Ithird_party/upb',
        '-Isrc/core/ext/upb-generated',
        '-fvisibility=hidden',
    ],
    'ldflags': [
        '-g',
    ],
    'cflags_c': [
      '-std=c99'
    ],
    'cflags_cc': [
      '-std=c++14'
    ],
    'include_dirs': [
      'deps/grpc',
      'deps/grpc/include',
      'deps/grpc/src/core/ext/upb-generated',
      'deps/grpc/third_party/abseil-cpp',
      'deps/grpc/third_party/address_sorting/include',
      'deps/grpc/third_party/cares',
      'deps/grpc/third_party/cares/cares',
      'deps/grpc/third_party/nanopb',
      'deps/grpc/third_party/upb',
      'deps/grpc/third_party/upb/generated_for_cmake',
    ],
    'defines': [
      'PB_FIELD_32BIT',
      'GPR_BACKWARDS_COMPATIBILITY_MODE',
      'GRPC_ARES=1',
      'GRPC_UV',
      'GRPC_NODE_VERSION="1.24.4"',
      'CARES_STATICLIB',
      'CARES_SYMBOL_HIDING'
    ],
    'defines!': [
      'OPENSSL_THREADS'
    ],
    'conditions': [
      ['grpc_gcov=="true"', {
        'cflags': [
            '-O0',
            '-fprofile-arcs',
            '-ftest-coverage',
            '-Wno-return-type',
        ],
        'defines': [
            '_DEBUG',
            'DEBUG',
            'GPR_GCOV',
        ],
        'ldflags': [
            '-fprofile-arcs',
            '-ftest-coverage',
            '-rdynamic',
            '-lstdc++',
        ],
      }],
      ['grpc_alpine=="true"', {
        'defines': [
          'GPR_MUSL_LIBC_COMPAT'
        ]
      }],
      # This is the condition for using boringssl
      ['OS=="win" or runtime=="electron"', {
        "include_dirs": [
          "deps/grpc/third_party/boringssl/include"
        ],
        "defines": [
          'OPENSSL_NO_ASM'
        ]
      }, {
        'conditions': [
          ["target_arch=='ia32'", {
             "include_dirs": [ "<(node_root_dir)/deps/openssl/config/piii" ]
          }],
          ["target_arch=='x64'", {
             "include_dirs": [ "<(node_root_dir)/deps/openssl/config/k8" ]
          }],
          ["target_arch=='arm'", {
             "include_dirs": [ "<(node_root_dir)/deps/openssl/config/arm" ]
          }],
          ['grpc_alpn=="true"', {
            'defines': [
              'TSI_OPENSSL_ALPN_SUPPORT=1'
            ],
          }, {
            'defines': [
              'TSI_OPENSSL_ALPN_SUPPORT=0'
            ],
          }]
        ],
        'include_dirs': [
          '<(node_root_dir)/deps/openssl/openssl/include',
        ]
      }],
      ['OS == "win"', {
        "include_dirs": [
          "deps/grpc/third_party/zlib"
        ],
        "defines": [
          '_WIN32_WINNT=0x0600',
          'WIN32_LEAN_AND_MEAN',
          '_HAS_EXCEPTIONS=0',
          'UNICODE',
          '_UNICODE',
          'NOMINMAX',
        ],
        "msvs_settings": {
          'VCCLCompilerTool': {
            'RuntimeLibrary': 1, # static debug
          }
        },
        "libraries": [
          "ws2_32"
        ]
      }, { # OS != "win"
        'include_dirs': [
          '<(node_root_dir)/deps/zlib'
        ]
      }],
      ['OS == "mac"', {
        'xcode_settings': {
          'OTHER_CFLAGS': [
              '-g',
              '-Wall',
              '-Wextra',
              '-DOSATOMIC_USE_INLINED=1',
              '-Ithird_party/upb',
              '-Isrc/core/ext/upb-generated',
              '-fvisibility=hidden',
          ],
          'OTHER_CPLUSPLUSFLAGS': [
              '-g',
              '-Wall',
              '-Wextra',
              '-DOSATOMIC_USE_INLINED=1',
              '-Ithird_party/upb',
              '-Isrc/core/ext/upb-generated',
              '-fvisibility=hidden',
            '-stdlib=libc++',
            '-std=c++1y',
            '-Wno-error=deprecated-declarations'
          ],
        },
      }]
    ]
  },
  'conditions': [
    ['OS=="win" or runtime=="electron"', {
      'targets': [
        {
          'target_name': 'boringssl',
          'product_prefix': 'lib',
          'type': 'static_library',
          'cflags': [
            '-Wno-implicit-fallthrough'
          ],
          'defines': [
            '_XOPEN_SOURCE=700'
          ],
          'dependencies': [
          ],
          'sources': [
            'deps/grpc/src/boringssl/err_data.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_bitstr.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_bool.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_d2i_fp.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_dup.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_enum.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_gentm.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_i2d_fp.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_int.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_mbstr.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_object.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_octet.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_print.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_strnid.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_time.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_type.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_utctm.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/a_utf8.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/asn1_lib.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/asn1_par.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/asn_pack.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/f_enum.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/f_int.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/f_string.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/tasn_dec.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/tasn_enc.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/tasn_fre.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/tasn_new.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/tasn_typ.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/tasn_utl.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/time_support.c',
            'deps/grpc/third_party/boringssl/crypto/base64/base64.c',
            'deps/grpc/third_party/boringssl/crypto/bio/bio.c',
            'deps/grpc/third_party/boringssl/crypto/bio/bio_mem.c',
            'deps/grpc/third_party/boringssl/crypto/bio/connect.c',
            'deps/grpc/third_party/boringssl/crypto/bio/fd.c',
            'deps/grpc/third_party/boringssl/crypto/bio/file.c',
            'deps/grpc/third_party/boringssl/crypto/bio/hexdump.c',
            'deps/grpc/third_party/boringssl/crypto/bio/pair.c',
            'deps/grpc/third_party/boringssl/crypto/bio/printf.c',
            'deps/grpc/third_party/boringssl/crypto/bio/socket.c',
            'deps/grpc/third_party/boringssl/crypto/bio/socket_helper.c',
            'deps/grpc/third_party/boringssl/crypto/bn_extra/bn_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/bn_extra/convert.c',
            'deps/grpc/third_party/boringssl/crypto/buf/buf.c',
            'deps/grpc/third_party/boringssl/crypto/bytestring/asn1_compat.c',
            'deps/grpc/third_party/boringssl/crypto/bytestring/ber.c',
            'deps/grpc/third_party/boringssl/crypto/bytestring/cbb.c',
            'deps/grpc/third_party/boringssl/crypto/bytestring/cbs.c',
            'deps/grpc/third_party/boringssl/crypto/chacha/chacha.c',
            'deps/grpc/third_party/boringssl/crypto/cipher_extra/cipher_extra.c',
            'deps/grpc/third_party/boringssl/crypto/cipher_extra/derive_key.c',
            'deps/grpc/third_party/boringssl/crypto/cipher_extra/e_aesccm.c',
            'deps/grpc/third_party/boringssl/crypto/cipher_extra/e_aesctrhmac.c',
            'deps/grpc/third_party/boringssl/crypto/cipher_extra/e_aesgcmsiv.c',
            'deps/grpc/third_party/boringssl/crypto/cipher_extra/e_chacha20poly1305.c',
            'deps/grpc/third_party/boringssl/crypto/cipher_extra/e_null.c',
            'deps/grpc/third_party/boringssl/crypto/cipher_extra/e_rc2.c',
            'deps/grpc/third_party/boringssl/crypto/cipher_extra/e_rc4.c',
            'deps/grpc/third_party/boringssl/crypto/cipher_extra/e_ssl3.c',
            'deps/grpc/third_party/boringssl/crypto/cipher_extra/e_tls.c',
            'deps/grpc/third_party/boringssl/crypto/cipher_extra/tls_cbc.c',
            'deps/grpc/third_party/boringssl/crypto/cmac/cmac.c',
            'deps/grpc/third_party/boringssl/crypto/conf/conf.c',
            'deps/grpc/third_party/boringssl/crypto/cpu-aarch64-fuchsia.c',
            'deps/grpc/third_party/boringssl/crypto/cpu-aarch64-linux.c',
            'deps/grpc/third_party/boringssl/crypto/cpu-arm-linux.c',
            'deps/grpc/third_party/boringssl/crypto/cpu-arm.c',
            'deps/grpc/third_party/boringssl/crypto/cpu-intel.c',
            'deps/grpc/third_party/boringssl/crypto/cpu-ppc64le.c',
            'deps/grpc/third_party/boringssl/crypto/crypto.c',
            'deps/grpc/third_party/boringssl/crypto/curve25519/spake25519.c',
            'deps/grpc/third_party/boringssl/crypto/dh/check.c',
            'deps/grpc/third_party/boringssl/crypto/dh/dh.c',
            'deps/grpc/third_party/boringssl/crypto/dh/dh_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/dh/params.c',
            'deps/grpc/third_party/boringssl/crypto/digest_extra/digest_extra.c',
            'deps/grpc/third_party/boringssl/crypto/dsa/dsa.c',
            'deps/grpc/third_party/boringssl/crypto/dsa/dsa_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/ec_extra/ec_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/ecdh/ecdh.c',
            'deps/grpc/third_party/boringssl/crypto/ecdsa_extra/ecdsa_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/engine/engine.c',
            'deps/grpc/third_party/boringssl/crypto/err/err.c',
            'deps/grpc/third_party/boringssl/crypto/evp/digestsign.c',
            'deps/grpc/third_party/boringssl/crypto/evp/evp.c',
            'deps/grpc/third_party/boringssl/crypto/evp/evp_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/evp/evp_ctx.c',
            'deps/grpc/third_party/boringssl/crypto/evp/p_dsa_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/evp/p_ec.c',
            'deps/grpc/third_party/boringssl/crypto/evp/p_ec_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/evp/p_ed25519.c',
            'deps/grpc/third_party/boringssl/crypto/evp/p_ed25519_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/evp/p_rsa.c',
            'deps/grpc/third_party/boringssl/crypto/evp/p_rsa_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/evp/pbkdf.c',
            'deps/grpc/third_party/boringssl/crypto/evp/print.c',
            'deps/grpc/third_party/boringssl/crypto/evp/scrypt.c',
            'deps/grpc/third_party/boringssl/crypto/evp/sign.c',
            'deps/grpc/third_party/boringssl/crypto/ex_data.c',
            'deps/grpc/third_party/boringssl/crypto/fipsmodule/bcm.c',
            'deps/grpc/third_party/boringssl/crypto/fipsmodule/is_fips.c',
            'deps/grpc/third_party/boringssl/crypto/hkdf/hkdf.c',
            'deps/grpc/third_party/boringssl/crypto/lhash/lhash.c',
            'deps/grpc/third_party/boringssl/crypto/mem.c',
            'deps/grpc/third_party/boringssl/crypto/obj/obj.c',
            'deps/grpc/third_party/boringssl/crypto/obj/obj_xref.c',
            'deps/grpc/third_party/boringssl/crypto/pem/pem_all.c',
            'deps/grpc/third_party/boringssl/crypto/pem/pem_info.c',
            'deps/grpc/third_party/boringssl/crypto/pem/pem_lib.c',
            'deps/grpc/third_party/boringssl/crypto/pem/pem_oth.c',
            'deps/grpc/third_party/boringssl/crypto/pem/pem_pk8.c',
            'deps/grpc/third_party/boringssl/crypto/pem/pem_pkey.c',
            'deps/grpc/third_party/boringssl/crypto/pem/pem_x509.c',
            'deps/grpc/third_party/boringssl/crypto/pem/pem_xaux.c',
            'deps/grpc/third_party/boringssl/crypto/pkcs7/pkcs7.c',
            'deps/grpc/third_party/boringssl/crypto/pkcs7/pkcs7_x509.c',
            'deps/grpc/third_party/boringssl/crypto/pkcs8/p5_pbev2.c',
            'deps/grpc/third_party/boringssl/crypto/pkcs8/pkcs8.c',
            'deps/grpc/third_party/boringssl/crypto/pkcs8/pkcs8_x509.c',
            'deps/grpc/third_party/boringssl/crypto/poly1305/poly1305.c',
            'deps/grpc/third_party/boringssl/crypto/poly1305/poly1305_arm.c',
            'deps/grpc/third_party/boringssl/crypto/poly1305/poly1305_vec.c',
            'deps/grpc/third_party/boringssl/crypto/pool/pool.c',
            'deps/grpc/third_party/boringssl/crypto/rand_extra/deterministic.c',
            'deps/grpc/third_party/boringssl/crypto/rand_extra/forkunsafe.c',
            'deps/grpc/third_party/boringssl/crypto/rand_extra/fuchsia.c',
            'deps/grpc/third_party/boringssl/crypto/rand_extra/rand_extra.c',
            'deps/grpc/third_party/boringssl/crypto/rand_extra/windows.c',
            'deps/grpc/third_party/boringssl/crypto/rc4/rc4.c',
            'deps/grpc/third_party/boringssl/crypto/refcount_c11.c',
            'deps/grpc/third_party/boringssl/crypto/refcount_lock.c',
            'deps/grpc/third_party/boringssl/crypto/rsa_extra/rsa_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/stack/stack.c',
            'deps/grpc/third_party/boringssl/crypto/thread.c',
            'deps/grpc/third_party/boringssl/crypto/thread_none.c',
            'deps/grpc/third_party/boringssl/crypto/thread_pthread.c',
            'deps/grpc/third_party/boringssl/crypto/thread_win.c',
            'deps/grpc/third_party/boringssl/crypto/x509/a_digest.c',
            'deps/grpc/third_party/boringssl/crypto/x509/a_sign.c',
            'deps/grpc/third_party/boringssl/crypto/x509/a_strex.c',
            'deps/grpc/third_party/boringssl/crypto/x509/a_verify.c',
            'deps/grpc/third_party/boringssl/crypto/x509/algorithm.c',
            'deps/grpc/third_party/boringssl/crypto/x509/asn1_gen.c',
            'deps/grpc/third_party/boringssl/crypto/x509/by_dir.c',
            'deps/grpc/third_party/boringssl/crypto/x509/by_file.c',
            'deps/grpc/third_party/boringssl/crypto/x509/i2d_pr.c',
            'deps/grpc/third_party/boringssl/crypto/x509/rsa_pss.c',
            'deps/grpc/third_party/boringssl/crypto/x509/t_crl.c',
            'deps/grpc/third_party/boringssl/crypto/x509/t_req.c',
            'deps/grpc/third_party/boringssl/crypto/x509/t_x509.c',
            'deps/grpc/third_party/boringssl/crypto/x509/t_x509a.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509_att.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509_cmp.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509_d2.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509_def.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509_ext.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509_lu.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509_obj.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509_r2x.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509_req.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509_set.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509_trs.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509_txt.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509_v3.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509_vfy.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509_vpm.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509cset.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509name.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509rset.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x509spki.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x_algor.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x_all.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x_attrib.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x_crl.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x_exten.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x_info.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x_name.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x_pkey.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x_pubkey.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x_req.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x_sig.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x_spki.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x_val.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x_x509.c',
            'deps/grpc/third_party/boringssl/crypto/x509/x_x509a.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/pcy_cache.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/pcy_data.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/pcy_lib.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/pcy_map.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/pcy_node.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/pcy_tree.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_akey.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_akeya.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_alt.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_bcons.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_bitst.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_conf.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_cpols.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_crld.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_enum.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_extku.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_genn.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_ia5.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_info.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_int.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_lib.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_ncons.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_pci.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_pcia.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_pcons.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_pku.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_pmaps.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_prn.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_purp.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_skey.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_sxnet.c',
            'deps/grpc/third_party/boringssl/crypto/x509v3/v3_utl.c',
            'deps/grpc/third_party/boringssl/ssl/bio_ssl.cc',
            'deps/grpc/third_party/boringssl/ssl/custom_extensions.cc',
            'deps/grpc/third_party/boringssl/ssl/d1_both.cc',
            'deps/grpc/third_party/boringssl/ssl/d1_lib.cc',
            'deps/grpc/third_party/boringssl/ssl/d1_pkt.cc',
            'deps/grpc/third_party/boringssl/ssl/d1_srtp.cc',
            'deps/grpc/third_party/boringssl/ssl/dtls_method.cc',
            'deps/grpc/third_party/boringssl/ssl/dtls_record.cc',
            'deps/grpc/third_party/boringssl/ssl/handoff.cc',
            'deps/grpc/third_party/boringssl/ssl/handshake.cc',
            'deps/grpc/third_party/boringssl/ssl/handshake_client.cc',
            'deps/grpc/third_party/boringssl/ssl/handshake_server.cc',
            'deps/grpc/third_party/boringssl/ssl/s3_both.cc',
            'deps/grpc/third_party/boringssl/ssl/s3_lib.cc',
            'deps/grpc/third_party/boringssl/ssl/s3_pkt.cc',
            'deps/grpc/third_party/boringssl/ssl/ssl_aead_ctx.cc',
            'deps/grpc/third_party/boringssl/ssl/ssl_asn1.cc',
            'deps/grpc/third_party/boringssl/ssl/ssl_buffer.cc',
            'deps/grpc/third_party/boringssl/ssl/ssl_cert.cc',
            'deps/grpc/third_party/boringssl/ssl/ssl_cipher.cc',
            'deps/grpc/third_party/boringssl/ssl/ssl_file.cc',
            'deps/grpc/third_party/boringssl/ssl/ssl_key_share.cc',
            'deps/grpc/third_party/boringssl/ssl/ssl_lib.cc',
            'deps/grpc/third_party/boringssl/ssl/ssl_privkey.cc',
            'deps/grpc/third_party/boringssl/ssl/ssl_session.cc',
            'deps/grpc/third_party/boringssl/ssl/ssl_stat.cc',
            'deps/grpc/third_party/boringssl/ssl/ssl_transcript.cc',
            'deps/grpc/third_party/boringssl/ssl/ssl_versions.cc',
            'deps/grpc/third_party/boringssl/ssl/ssl_x509.cc',
            'deps/grpc/third_party/boringssl/ssl/t1_enc.cc',
            'deps/grpc/third_party/boringssl/ssl/t1_lib.cc',
            'deps/grpc/third_party/boringssl/ssl/tls13_both.cc',
            'deps/grpc/third_party/boringssl/ssl/tls13_client.cc',
            'deps/grpc/third_party/boringssl/ssl/tls13_enc.cc',
            'deps/grpc/third_party/boringssl/ssl/tls13_server.cc',
            'deps/grpc/third_party/boringssl/ssl/tls_method.cc',
            'deps/grpc/third_party/boringssl/ssl/tls_record.cc',
            'deps/grpc/third_party/boringssl/third_party/fiat/curve25519.c',
          ],
          'conditions': [
            ['OS == "mac"', {
              'xcode_settings': {
                'MACOSX_DEPLOYMENT_TARGET': '10.9'
              }
            }]
          ]
        },
      ],
    }],
    ['OS == "win" and runtime!="electron"', {
      'targets': [
        {
          # IMPORTANT WINDOWS BUILD INFORMATION
          # This library does not build on Windows without modifying the Node
          # development packages that node-gyp downloads in order to build.
          # Due to https://github.com/nodejs/node/issues/4932, the headers for
          # BoringSSL conflict with the OpenSSL headers included by default
          # when including the Node headers. The remedy for this is to remove
          # the OpenSSL headers, from the downloaded Node development package,
          # which is typically located in `.node-gyp` in your home directory.
          #
          # This is not true of Electron, which does not have OpenSSL headers.
          'target_name': 'WINDOWS_BUILD_WARNING',
          'rules': [
            {
              'rule_name': 'WINDOWS_BUILD_WARNING',
              'extension': 'S',
              'inputs': [
                'package.json'
              ],
              'outputs': [
                'ignore_this_part'
              ],
              'action': ['echo', 'IMPORTANT: Due to https://github.com/nodejs/node/issues/4932, to build this library on Windows, you must first remove <(node_root_dir)/include/node/openssl/']
            }
          ]
        },
      ]
    }],
    ['OS == "win"', {
      'targets': [
        # Only want to compile zlib under Windows
        {
          'target_name': 'z',
          'product_prefix': 'lib',
          'type': 'static_library',
          'dependencies': [
          ],
          'sources': [
            'deps/grpc/third_party/zlib/adler32.c',
            'deps/grpc/third_party/zlib/compress.c',
            'deps/grpc/third_party/zlib/crc32.c',
            'deps/grpc/third_party/zlib/deflate.c',
            'deps/grpc/third_party/zlib/gzclose.c',
            'deps/grpc/third_party/zlib/gzlib.c',
            'deps/grpc/third_party/zlib/gzread.c',
            'deps/grpc/third_party/zlib/gzwrite.c',
            'deps/grpc/third_party/zlib/infback.c',
            'deps/grpc/third_party/zlib/inffast.c',
            'deps/grpc/third_party/zlib/inflate.c',
            'deps/grpc/third_party/zlib/inftrees.c',
            'deps/grpc/third_party/zlib/trees.c',
            'deps/grpc/third_party/zlib/uncompr.c',
            'deps/grpc/third_party/zlib/zutil.c',
          ]
        },
      ]
    }]
  ],
  'targets': [
    {
      'target_name': 'ares',
      'product_prefix': 'lib',
      'type': 'static_library',
      'sources': [
        'deps/grpc/third_party/cares/cares/ares__close_sockets.c',
        'deps/grpc/third_party/cares/cares/ares__get_hostent.c',
        'deps/grpc/third_party/cares/cares/ares__read_line.c',
        'deps/grpc/third_party/cares/cares/ares__timeval.c',
        'deps/grpc/third_party/cares/cares/ares_cancel.c',
        'deps/grpc/third_party/cares/cares/ares_create_query.c',
        'deps/grpc/third_party/cares/cares/ares_data.c',
        'deps/grpc/third_party/cares/cares/ares_destroy.c',
        'deps/grpc/third_party/cares/cares/ares_expand_name.c',
        'deps/grpc/third_party/cares/cares/ares_expand_string.c',
        'deps/grpc/third_party/cares/cares/ares_fds.c',
        'deps/grpc/third_party/cares/cares/ares_free_hostent.c',
        'deps/grpc/third_party/cares/cares/ares_free_string.c',
        'deps/grpc/third_party/cares/cares/ares_getenv.c',
        'deps/grpc/third_party/cares/cares/ares_gethostbyaddr.c',
        'deps/grpc/third_party/cares/cares/ares_gethostbyname.c',
        'deps/grpc/third_party/cares/cares/ares_getnameinfo.c',
        'deps/grpc/third_party/cares/cares/ares_getopt.c',
        'deps/grpc/third_party/cares/cares/ares_getsock.c',
        'deps/grpc/third_party/cares/cares/ares_init.c',
        'deps/grpc/third_party/cares/cares/ares_library_init.c',
        'deps/grpc/third_party/cares/cares/ares_llist.c',
        'deps/grpc/third_party/cares/cares/ares_mkquery.c',
        'deps/grpc/third_party/cares/cares/ares_nowarn.c',
        'deps/grpc/third_party/cares/cares/ares_options.c',
        'deps/grpc/third_party/cares/cares/ares_parse_a_reply.c',
        'deps/grpc/third_party/cares/cares/ares_parse_aaaa_reply.c',
        'deps/grpc/third_party/cares/cares/ares_parse_mx_reply.c',
        'deps/grpc/third_party/cares/cares/ares_parse_naptr_reply.c',
        'deps/grpc/third_party/cares/cares/ares_parse_ns_reply.c',
        'deps/grpc/third_party/cares/cares/ares_parse_ptr_reply.c',
        'deps/grpc/third_party/cares/cares/ares_parse_soa_reply.c',
        'deps/grpc/third_party/cares/cares/ares_parse_srv_reply.c',
        'deps/grpc/third_party/cares/cares/ares_parse_txt_reply.c',
        'deps/grpc/third_party/cares/cares/ares_platform.c',
        'deps/grpc/third_party/cares/cares/ares_process.c',
        'deps/grpc/third_party/cares/cares/ares_query.c',
        'deps/grpc/third_party/cares/cares/ares_search.c',
        'deps/grpc/third_party/cares/cares/ares_send.c',
        'deps/grpc/third_party/cares/cares/ares_strcasecmp.c',
        'deps/grpc/third_party/cares/cares/ares_strdup.c',
        'deps/grpc/third_party/cares/cares/ares_strerror.c',
        'deps/grpc/third_party/cares/cares/ares_strsplit.c',
        'deps/grpc/third_party/cares/cares/ares_timeout.c',
        'deps/grpc/third_party/cares/cares/ares_version.c',
        'deps/grpc/third_party/cares/cares/ares_writev.c',
        'deps/grpc/third_party/cares/cares/bitncmp.c',
        'deps/grpc/third_party/cares/cares/inet_net_pton.c',
        'deps/grpc/third_party/cares/cares/inet_ntop.c',
        'deps/grpc/third_party/cares/cares/windows_port.c',
      ],
      'defines': [
        '_GNU_SOURCE'
      ],
      'conditions': [
        ['OS == "mac"', {
          'xcode_settings': {
            'MACOSX_DEPLOYMENT_TARGET': '10.9'
          },
          'include_dirs': [
            'deps/grpc/third_party/cares/config_darwin'
          ],
          'defines': [
            'HAVE_CONFIG_H'
          ]
        }],
        ['OS == "linux"', {
          'include_dirs': [
            'deps/grpc/third_party/cares/config_linux'
          ],
          'defines': [
            'HAVE_CONFIG_H'
          ]
        }],
        ['OS == "win"', {
          'include_dirs': [
            'deps/grpc/third_party/cares/config_windows'
          ],
          'defines': [
            'HAVE_CONFIG_H'
          ]
        }]
      ]
    },
    {
      'target_name': 'address_sorting',
      'product_prefix': 'lib',
      'type': 'static_library',
      'dependencies': [
      ],
      'sources': [
        'deps/grpc/third_party/address_sorting/address_sorting.c',
        'deps/grpc/third_party/address_sorting/address_sorting_posix.c',
        'deps/grpc/third_party/address_sorting/address_sorting_windows.c',
      ],
      'conditions': [
        ['OS == "mac"', {
          'xcode_settings': {
            'MACOSX_DEPLOYMENT_TARGET': '10.9'
          }
        }]
      ]
    },
    {
      'target_name': 'gpr',
      'product_prefix': 'lib',
      'type': 'static_library',
      'dependencies': [
      ],
      'sources': [
        'deps/grpc/src/core/lib/gpr/alloc.cc',
        'deps/grpc/src/core/lib/gpr/atm.cc',
        'deps/grpc/src/core/lib/gpr/cpu_iphone.cc',
        'deps/grpc/src/core/lib/gpr/cpu_linux.cc',
        'deps/grpc/src/core/lib/gpr/cpu_posix.cc',
        'deps/grpc/src/core/lib/gpr/cpu_windows.cc',
        'deps/grpc/src/core/lib/gpr/env_linux.cc',
        'deps/grpc/src/core/lib/gpr/env_posix.cc',
        'deps/grpc/src/core/lib/gpr/env_windows.cc',
        'deps/grpc/src/core/lib/gpr/log.cc',
        'deps/grpc/src/core/lib/gpr/log_android.cc',
        'deps/grpc/src/core/lib/gpr/log_linux.cc',
        'deps/grpc/src/core/lib/gpr/log_posix.cc',
        'deps/grpc/src/core/lib/gpr/log_windows.cc',
        'deps/grpc/src/core/lib/gpr/mpscq.cc',
        'deps/grpc/src/core/lib/gpr/murmur_hash.cc',
        'deps/grpc/src/core/lib/gpr/string.cc',
        'deps/grpc/src/core/lib/gpr/string_posix.cc',
        'deps/grpc/src/core/lib/gpr/string_util_windows.cc',
        'deps/grpc/src/core/lib/gpr/string_windows.cc',
        'deps/grpc/src/core/lib/gpr/sync.cc',
        'deps/grpc/src/core/lib/gpr/sync_posix.cc',
        'deps/grpc/src/core/lib/gpr/sync_windows.cc',
        'deps/grpc/src/core/lib/gpr/time.cc',
        'deps/grpc/src/core/lib/gpr/time_posix.cc',
        'deps/grpc/src/core/lib/gpr/time_precise.cc',
        'deps/grpc/src/core/lib/gpr/time_windows.cc',
        'deps/grpc/src/core/lib/gpr/tls_pthread.cc',
        'deps/grpc/src/core/lib/gpr/tmpfile_msys.cc',
        'deps/grpc/src/core/lib/gpr/tmpfile_posix.cc',
        'deps/grpc/src/core/lib/gpr/tmpfile_windows.cc',
        'deps/grpc/src/core/lib/gpr/wrap_memcpy.cc',
        'deps/grpc/src/core/lib/gprpp/arena.cc',
        'deps/grpc/src/core/lib/gprpp/fork.cc',
        'deps/grpc/src/core/lib/gprpp/global_config_env.cc',
        'deps/grpc/src/core/lib/gprpp/host_port.cc',
        'deps/grpc/src/core/lib/gprpp/thd_posix.cc',
        'deps/grpc/src/core/lib/gprpp/thd_windows.cc',
        'deps/grpc/src/core/lib/profiling/basic_timers.cc',
        'deps/grpc/src/core/lib/profiling/stap_timers.cc',
      ],
      'conditions': [
        ['OS == "mac"', {
          'xcode_settings': {
            'MACOSX_DEPLOYMENT_TARGET': '10.9'
          }
        }]
      ]
    },
    {
      'target_name': 'grpc',
      'product_prefix': 'lib',
      'type': 'static_library',
      'dependencies': [
        'gpr',
      ],
      'sources': [
        'deps/grpc/src/core/lib/surface/init.cc',
        'deps/grpc/src/core/lib/avl/avl.cc',
        'deps/grpc/src/core/lib/backoff/backoff.cc',
        'deps/grpc/src/core/lib/channel/channel_args.cc',
        'deps/grpc/src/core/lib/channel/channel_stack.cc',
        'deps/grpc/src/core/lib/channel/channel_stack_builder.cc',
        'deps/grpc/src/core/lib/channel/channel_trace.cc',
        'deps/grpc/src/core/lib/channel/channelz.cc',
        'deps/grpc/src/core/lib/channel/channelz_registry.cc',
        'deps/grpc/src/core/lib/channel/connected_channel.cc',
        'deps/grpc/src/core/lib/channel/handshaker.cc',
        'deps/grpc/src/core/lib/channel/handshaker_registry.cc',
        'deps/grpc/src/core/lib/channel/status_util.cc',
        'deps/grpc/src/core/lib/compression/compression.cc',
        'deps/grpc/src/core/lib/compression/compression_args.cc',
        'deps/grpc/src/core/lib/compression/compression_internal.cc',
        'deps/grpc/src/core/lib/compression/message_compress.cc',
        'deps/grpc/src/core/lib/compression/stream_compression.cc',
        'deps/grpc/src/core/lib/compression/stream_compression_gzip.cc',
        'deps/grpc/src/core/lib/compression/stream_compression_identity.cc',
        'deps/grpc/src/core/lib/debug/stats.cc',
        'deps/grpc/src/core/lib/debug/stats_data.cc',
        'deps/grpc/src/core/lib/http/format_request.cc',
        'deps/grpc/src/core/lib/http/httpcli.cc',
        'deps/grpc/src/core/lib/http/parser.cc',
        'deps/grpc/src/core/lib/iomgr/buffer_list.cc',
        'deps/grpc/src/core/lib/iomgr/call_combiner.cc',
        'deps/grpc/src/core/lib/iomgr/cfstream_handle.cc',
        'deps/grpc/src/core/lib/iomgr/combiner.cc',
        'deps/grpc/src/core/lib/iomgr/endpoint.cc',
        'deps/grpc/src/core/lib/iomgr/endpoint_cfstream.cc',
        'deps/grpc/src/core/lib/iomgr/endpoint_pair_posix.cc',
        'deps/grpc/src/core/lib/iomgr/endpoint_pair_uv.cc',
        'deps/grpc/src/core/lib/iomgr/endpoint_pair_windows.cc',
        'deps/grpc/src/core/lib/iomgr/error.cc',
        'deps/grpc/src/core/lib/iomgr/error_cfstream.cc',
        'deps/grpc/src/core/lib/iomgr/ev_epoll1_linux.cc',
        'deps/grpc/src/core/lib/iomgr/ev_epollex_linux.cc',
        'deps/grpc/src/core/lib/iomgr/ev_poll_posix.cc',
        'deps/grpc/src/core/lib/iomgr/ev_posix.cc',
        'deps/grpc/src/core/lib/iomgr/ev_windows.cc',
        'deps/grpc/src/core/lib/iomgr/exec_ctx.cc',
        'deps/grpc/src/core/lib/iomgr/executor.cc',
        'deps/grpc/src/core/lib/iomgr/executor/mpmcqueue.cc',
        'deps/grpc/src/core/lib/iomgr/executor/threadpool.cc',
        'deps/grpc/src/core/lib/iomgr/fork_posix.cc',
        'deps/grpc/src/core/lib/iomgr/fork_windows.cc',
        'deps/grpc/src/core/lib/iomgr/gethostname_fallback.cc',
        'deps/grpc/src/core/lib/iomgr/gethostname_host_name_max.cc',
        'deps/grpc/src/core/lib/iomgr/gethostname_sysconf.cc',
        'deps/grpc/src/core/lib/iomgr/grpc_if_nametoindex_posix.cc',
        'deps/grpc/src/core/lib/iomgr/grpc_if_nametoindex_unsupported.cc',
        'deps/grpc/src/core/lib/iomgr/internal_errqueue.cc',
        'deps/grpc/src/core/lib/iomgr/iocp_windows.cc',
        'deps/grpc/src/core/lib/iomgr/iomgr.cc',
        'deps/grpc/src/core/lib/iomgr/iomgr_custom.cc',
        'deps/grpc/src/core/lib/iomgr/iomgr_internal.cc',
        'deps/grpc/src/core/lib/iomgr/iomgr_posix.cc',
        'deps/grpc/src/core/lib/iomgr/iomgr_posix_cfstream.cc',
        'deps/grpc/src/core/lib/iomgr/iomgr_uv.cc',
        'deps/grpc/src/core/lib/iomgr/iomgr_windows.cc',
        'deps/grpc/src/core/lib/iomgr/is_epollexclusive_available.cc',
        'deps/grpc/src/core/lib/iomgr/load_file.cc',
        'deps/grpc/src/core/lib/iomgr/lockfree_event.cc',
        'deps/grpc/src/core/lib/iomgr/polling_entity.cc',
        'deps/grpc/src/core/lib/iomgr/pollset.cc',
        'deps/grpc/src/core/lib/iomgr/pollset_custom.cc',
        'deps/grpc/src/core/lib/iomgr/pollset_set.cc',
        'deps/grpc/src/core/lib/iomgr/pollset_set_custom.cc',
        'deps/grpc/src/core/lib/iomgr/pollset_set_windows.cc',
        'deps/grpc/src/core/lib/iomgr/pollset_uv.cc',
        'deps/grpc/src/core/lib/iomgr/pollset_windows.cc',
        'deps/grpc/src/core/lib/iomgr/resolve_address.cc',
        'deps/grpc/src/core/lib/iomgr/resolve_address_custom.cc',
        'deps/grpc/src/core/lib/iomgr/resolve_address_posix.cc',
        'deps/grpc/src/core/lib/iomgr/resolve_address_windows.cc',
        'deps/grpc/src/core/lib/iomgr/resource_quota.cc',
        'deps/grpc/src/core/lib/iomgr/sockaddr_utils.cc',
        'deps/grpc/src/core/lib/iomgr/socket_factory_posix.cc',
        'deps/grpc/src/core/lib/iomgr/socket_mutator.cc',
        'deps/grpc/src/core/lib/iomgr/socket_utils_common_posix.cc',
        'deps/grpc/src/core/lib/iomgr/socket_utils_linux.cc',
        'deps/grpc/src/core/lib/iomgr/socket_utils_posix.cc',
        'deps/grpc/src/core/lib/iomgr/socket_utils_uv.cc',
        'deps/grpc/src/core/lib/iomgr/socket_utils_windows.cc',
        'deps/grpc/src/core/lib/iomgr/socket_windows.cc',
        'deps/grpc/src/core/lib/iomgr/tcp_client.cc',
        'deps/grpc/src/core/lib/iomgr/tcp_client_cfstream.cc',
        'deps/grpc/src/core/lib/iomgr/tcp_client_custom.cc',
        'deps/grpc/src/core/lib/iomgr/tcp_client_posix.cc',
        'deps/grpc/src/core/lib/iomgr/tcp_client_windows.cc',
        'deps/grpc/src/core/lib/iomgr/tcp_custom.cc',
        'deps/grpc/src/core/lib/iomgr/tcp_posix.cc',
        'deps/grpc/src/core/lib/iomgr/tcp_server.cc',
        'deps/grpc/src/core/lib/iomgr/tcp_server_custom.cc',
        'deps/grpc/src/core/lib/iomgr/tcp_server_posix.cc',
        'deps/grpc/src/core/lib/iomgr/tcp_server_utils_posix_common.cc',
        'deps/grpc/src/core/lib/iomgr/tcp_server_utils_posix_ifaddrs.cc',
        'deps/grpc/src/core/lib/iomgr/tcp_server_utils_posix_noifaddrs.cc',
        'deps/grpc/src/core/lib/iomgr/tcp_server_windows.cc',
        'deps/grpc/src/core/lib/iomgr/tcp_uv.cc',
        'deps/grpc/src/core/lib/iomgr/tcp_windows.cc',
        'deps/grpc/src/core/lib/iomgr/time_averaged_stats.cc',
        'deps/grpc/src/core/lib/iomgr/timer.cc',
        'deps/grpc/src/core/lib/iomgr/timer_custom.cc',
        'deps/grpc/src/core/lib/iomgr/timer_generic.cc',
        'deps/grpc/src/core/lib/iomgr/timer_heap.cc',
        'deps/grpc/src/core/lib/iomgr/timer_manager.cc',
        'deps/grpc/src/core/lib/iomgr/timer_uv.cc',
        'deps/grpc/src/core/lib/iomgr/udp_server.cc',
        'deps/grpc/src/core/lib/iomgr/unix_sockets_posix.cc',
        'deps/grpc/src/core/lib/iomgr/unix_sockets_posix_noop.cc',
        'deps/grpc/src/core/lib/iomgr/wakeup_fd_eventfd.cc',
        'deps/grpc/src/core/lib/iomgr/wakeup_fd_nospecial.cc',
        'deps/grpc/src/core/lib/iomgr/wakeup_fd_pipe.cc',
        'deps/grpc/src/core/lib/iomgr/wakeup_fd_posix.cc',
        'deps/grpc/src/core/lib/json/json.cc',
        'deps/grpc/src/core/lib/json/json_reader.cc',
        'deps/grpc/src/core/lib/json/json_string.cc',
        'deps/grpc/src/core/lib/json/json_writer.cc',
        'deps/grpc/src/core/lib/slice/b64.cc',
        'deps/grpc/src/core/lib/slice/percent_encoding.cc',
        'deps/grpc/src/core/lib/slice/slice.cc',
        'deps/grpc/src/core/lib/slice/slice_buffer.cc',
        'deps/grpc/src/core/lib/slice/slice_intern.cc',
        'deps/grpc/src/core/lib/slice/slice_string_helpers.cc',
        'deps/grpc/src/core/lib/surface/api_trace.cc',
        'deps/grpc/src/core/lib/surface/byte_buffer.cc',
        'deps/grpc/src/core/lib/surface/byte_buffer_reader.cc',
        'deps/grpc/src/core/lib/surface/call.cc',
        'deps/grpc/src/core/lib/surface/call_details.cc',
        'deps/grpc/src/core/lib/surface/call_log_batch.cc',
        'deps/grpc/src/core/lib/surface/channel.cc',
        'deps/grpc/src/core/lib/surface/channel_init.cc',
        'deps/grpc/src/core/lib/surface/channel_ping.cc',
        'deps/grpc/src/core/lib/surface/channel_stack_type.cc',
        'deps/grpc/src/core/lib/surface/completion_queue.cc',
        'deps/grpc/src/core/lib/surface/completion_queue_factory.cc',
        'deps/grpc/src/core/lib/surface/event_string.cc',
        'deps/grpc/src/core/lib/surface/lame_client.cc',
        'deps/grpc/src/core/lib/surface/metadata_array.cc',
        'deps/grpc/src/core/lib/surface/server.cc',
        'deps/grpc/src/core/lib/surface/validate_metadata.cc',
        'deps/grpc/src/core/lib/surface/version.cc',
        'deps/grpc/src/core/lib/transport/bdp_estimator.cc',
        'deps/grpc/src/core/lib/transport/byte_stream.cc',
        'deps/grpc/src/core/lib/transport/connectivity_state.cc',
        'deps/grpc/src/core/lib/transport/error_utils.cc',
        'deps/grpc/src/core/lib/transport/metadata.cc',
        'deps/grpc/src/core/lib/transport/metadata_batch.cc',
        'deps/grpc/src/core/lib/transport/pid_controller.cc',
        'deps/grpc/src/core/lib/transport/static_metadata.cc',
        'deps/grpc/src/core/lib/transport/status_conversion.cc',
        'deps/grpc/src/core/lib/transport/status_metadata.cc',
        'deps/grpc/src/core/lib/transport/timeout_encoding.cc',
        'deps/grpc/src/core/lib/transport/transport.cc',
        'deps/grpc/src/core/lib/transport/transport_op_string.cc',
        'deps/grpc/src/core/lib/uri/uri_parser.cc',
        'deps/grpc/src/core/lib/debug/trace.cc',
        'deps/grpc/src/core/ext/transport/chttp2/server/secure/server_secure_chttp2.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/bin_decoder.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/bin_encoder.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/chttp2_plugin.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/chttp2_transport.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/context_list.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/flow_control.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/frame_data.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/frame_goaway.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/frame_ping.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/frame_rst_stream.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/frame_settings.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/frame_window_update.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/hpack_encoder.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/hpack_parser.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/hpack_table.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/http2_settings.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/huffsyms.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/incoming_metadata.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/parsing.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/stream_lists.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/stream_map.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/varint.cc',
        'deps/grpc/src/core/ext/transport/chttp2/transport/writing.cc',
        'deps/grpc/src/core/ext/transport/chttp2/alpn/alpn.cc',
        'deps/grpc/src/core/ext/filters/http/client/http_client_filter.cc',
        'deps/grpc/src/core/ext/filters/http/http_filters_plugin.cc',
        'deps/grpc/src/core/ext/filters/http/message_compress/message_compress_filter.cc',
        'deps/grpc/src/core/ext/filters/http/server/http_server_filter.cc',
        'deps/grpc/src/core/lib/http/httpcli_security_connector.cc',
        'deps/grpc/src/core/lib/security/context/security_context.cc',
        'deps/grpc/src/core/lib/security/credentials/alts/alts_credentials.cc',
        'deps/grpc/src/core/lib/security/credentials/composite/composite_credentials.cc',
        'deps/grpc/src/core/lib/security/credentials/credentials.cc',
        'deps/grpc/src/core/lib/security/credentials/credentials_metadata.cc',
        'deps/grpc/src/core/lib/security/credentials/fake/fake_credentials.cc',
        'deps/grpc/src/core/lib/security/credentials/google_default/credentials_generic.cc',
        'deps/grpc/src/core/lib/security/credentials/google_default/google_default_credentials.cc',
        'deps/grpc/src/core/lib/security/credentials/iam/iam_credentials.cc',
        'deps/grpc/src/core/lib/security/credentials/jwt/json_token.cc',
        'deps/grpc/src/core/lib/security/credentials/jwt/jwt_credentials.cc',
        'deps/grpc/src/core/lib/security/credentials/jwt/jwt_verifier.cc',
        'deps/grpc/src/core/lib/security/credentials/local/local_credentials.cc',
        'deps/grpc/src/core/lib/security/credentials/oauth2/oauth2_credentials.cc',
        'deps/grpc/src/core/lib/security/credentials/plugin/plugin_credentials.cc',
        'deps/grpc/src/core/lib/security/credentials/ssl/ssl_credentials.cc',
        'deps/grpc/src/core/lib/security/credentials/tls/grpc_tls_credentials_options.cc',
        'deps/grpc/src/core/lib/security/credentials/tls/spiffe_credentials.cc',
        'deps/grpc/src/core/lib/security/security_connector/alts/alts_security_connector.cc',
        'deps/grpc/src/core/lib/security/security_connector/fake/fake_security_connector.cc',
        'deps/grpc/src/core/lib/security/security_connector/load_system_roots_fallback.cc',
        'deps/grpc/src/core/lib/security/security_connector/load_system_roots_linux.cc',
        'deps/grpc/src/core/lib/security/security_connector/local/local_security_connector.cc',
        'deps/grpc/src/core/lib/security/security_connector/security_connector.cc',
        'deps/grpc/src/core/lib/security/security_connector/ssl/ssl_security_connector.cc',
        'deps/grpc/src/core/lib/security/security_connector/ssl_utils.cc',
        'deps/grpc/src/core/lib/security/security_connector/ssl_utils_config.cc',
        'deps/grpc/src/core/lib/security/security_connector/tls/spiffe_security_connector.cc',
        'deps/grpc/src/core/lib/security/transport/client_auth_filter.cc',
        'deps/grpc/src/core/lib/security/transport/secure_endpoint.cc',
        'deps/grpc/src/core/lib/security/transport/security_handshaker.cc',
        'deps/grpc/src/core/lib/security/transport/server_auth_filter.cc',
        'deps/grpc/src/core/lib/security/transport/target_authority_table.cc',
        'deps/grpc/src/core/lib/security/transport/tsi_error.cc',
        'deps/grpc/src/core/lib/security/util/json_util.cc',
        'deps/grpc/src/core/lib/surface/init_secure.cc',
        'deps/grpc/src/core/tsi/alts/crypt/aes_gcm.cc',
        'deps/grpc/src/core/tsi/alts/crypt/gsec.cc',
        'deps/grpc/src/core/tsi/alts/frame_protector/alts_counter.cc',
        'deps/grpc/src/core/tsi/alts/frame_protector/alts_crypter.cc',
        'deps/grpc/src/core/tsi/alts/frame_protector/alts_frame_protector.cc',
        'deps/grpc/src/core/tsi/alts/frame_protector/alts_record_protocol_crypter_common.cc',
        'deps/grpc/src/core/tsi/alts/frame_protector/alts_seal_privacy_integrity_crypter.cc',
        'deps/grpc/src/core/tsi/alts/frame_protector/alts_unseal_privacy_integrity_crypter.cc',
        'deps/grpc/src/core/tsi/alts/frame_protector/frame_handler.cc',
        'deps/grpc/src/core/tsi/alts/handshaker/alts_handshaker_client.cc',
        'deps/grpc/src/core/tsi/alts/handshaker/alts_shared_resource.cc',
        'deps/grpc/src/core/tsi/alts/handshaker/alts_tsi_handshaker.cc',
        'deps/grpc/src/core/tsi/alts/zero_copy_frame_protector/alts_grpc_integrity_only_record_protocol.cc',
        'deps/grpc/src/core/tsi/alts/zero_copy_frame_protector/alts_grpc_privacy_integrity_record_protocol.cc',
        'deps/grpc/src/core/tsi/alts/zero_copy_frame_protector/alts_grpc_record_protocol_common.cc',
        'deps/grpc/src/core/tsi/alts/zero_copy_frame_protector/alts_iovec_record_protocol.cc',
        'deps/grpc/src/core/tsi/alts/zero_copy_frame_protector/alts_zero_copy_grpc_protector.cc',
        'deps/grpc/src/core/lib/security/credentials/alts/check_gcp_environment.cc',
        'deps/grpc/src/core/lib/security/credentials/alts/check_gcp_environment_linux.cc',
        'deps/grpc/src/core/lib/security/credentials/alts/check_gcp_environment_no_op.cc',
        'deps/grpc/src/core/lib/security/credentials/alts/check_gcp_environment_windows.cc',
        'deps/grpc/src/core/lib/security/credentials/alts/grpc_alts_credentials_client_options.cc',
        'deps/grpc/src/core/lib/security/credentials/alts/grpc_alts_credentials_options.cc',
        'deps/grpc/src/core/lib/security/credentials/alts/grpc_alts_credentials_server_options.cc',
        'deps/grpc/src/core/tsi/alts/handshaker/alts_tsi_utils.cc',
        'deps/grpc/src/core/tsi/alts/handshaker/transport_security_common_api.cc',
        'deps/grpc/src/core/ext/upb-generated/src/proto/grpc/gcp/altscontext.upb.c',
        'deps/grpc/src/core/ext/upb-generated/src/proto/grpc/gcp/handshaker.upb.c',
        'deps/grpc/src/core/ext/upb-generated/src/proto/grpc/gcp/transport_security_common.upb.c',
        'deps/grpc/third_party/upb/upb/decode.c',
        'deps/grpc/third_party/upb/upb/encode.c',
        'deps/grpc/third_party/upb/upb/msg.c',
        'deps/grpc/third_party/upb/upb/port.c',
        'deps/grpc/third_party/upb/upb/table.c',
        'deps/grpc/third_party/upb/upb/upb.c',
        'deps/grpc/src/core/tsi/transport_security.cc',
        'deps/grpc/src/core/ext/transport/chttp2/client/insecure/channel_create.cc',
        'deps/grpc/src/core/ext/transport/chttp2/client/insecure/channel_create_posix.cc',
        'deps/grpc/src/core/ext/transport/chttp2/client/authority.cc',
        'deps/grpc/src/core/ext/transport/chttp2/client/chttp2_connector.cc',
        'deps/grpc/src/core/ext/filters/client_channel/backend_metric.cc',
        'deps/grpc/src/core/ext/filters/client_channel/backup_poller.cc',
        'deps/grpc/src/core/ext/filters/client_channel/channel_connectivity.cc',
        'deps/grpc/src/core/ext/filters/client_channel/client_channel.cc',
        'deps/grpc/src/core/ext/filters/client_channel/client_channel_channelz.cc',
        'deps/grpc/src/core/ext/filters/client_channel/client_channel_factory.cc',
        'deps/grpc/src/core/ext/filters/client_channel/client_channel_plugin.cc',
        'deps/grpc/src/core/ext/filters/client_channel/connector.cc',
        'deps/grpc/src/core/ext/filters/client_channel/global_subchannel_pool.cc',
        'deps/grpc/src/core/ext/filters/client_channel/health/health_check_client.cc',
        'deps/grpc/src/core/ext/filters/client_channel/http_connect_handshaker.cc',
        'deps/grpc/src/core/ext/filters/client_channel/http_proxy.cc',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy.cc',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy_registry.cc',
        'deps/grpc/src/core/ext/filters/client_channel/local_subchannel_pool.cc',
        'deps/grpc/src/core/ext/filters/client_channel/parse_address.cc',
        'deps/grpc/src/core/ext/filters/client_channel/proxy_mapper.cc',
        'deps/grpc/src/core/ext/filters/client_channel/proxy_mapper_registry.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver_registry.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver_result_parsing.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolving_lb_policy.cc',
        'deps/grpc/src/core/ext/filters/client_channel/retry_throttle.cc',
        'deps/grpc/src/core/ext/filters/client_channel/server_address.cc',
        'deps/grpc/src/core/ext/filters/client_channel/service_config.cc',
        'deps/grpc/src/core/ext/filters/client_channel/subchannel.cc',
        'deps/grpc/src/core/ext/filters/client_channel/subchannel_pool_interface.cc',
        'deps/grpc/src/core/ext/filters/deadline/deadline_filter.cc',
        'deps/grpc/src/core/ext/upb-generated/src/proto/grpc/health/v1/health.upb.c',
        'deps/grpc/src/core/ext/upb-generated/udpa/data/orca/v1/orca_load_report.upb.c',
        'deps/grpc/src/core/ext/upb-generated/gogoproto/gogo.upb.c',
        'deps/grpc/src/core/ext/upb-generated/validate/validate.upb.c',
        'deps/grpc/src/core/ext/upb-generated/google/api/annotations.upb.c',
        'deps/grpc/src/core/ext/upb-generated/google/api/http.upb.c',
        'deps/grpc/src/core/ext/upb-generated/google/protobuf/any.upb.c',
        'deps/grpc/src/core/ext/upb-generated/google/protobuf/descriptor.upb.c',
        'deps/grpc/src/core/ext/upb-generated/google/protobuf/duration.upb.c',
        'deps/grpc/src/core/ext/upb-generated/google/protobuf/empty.upb.c',
        'deps/grpc/src/core/ext/upb-generated/google/protobuf/struct.upb.c',
        'deps/grpc/src/core/ext/upb-generated/google/protobuf/timestamp.upb.c',
        'deps/grpc/src/core/ext/upb-generated/google/protobuf/wrappers.upb.c',
        'deps/grpc/src/core/ext/upb-generated/google/rpc/status.upb.c',
        'deps/grpc/src/core/tsi/fake_transport_security.cc',
        'deps/grpc/src/core/tsi/local_transport_security.cc',
        'deps/grpc/src/core/tsi/ssl/session_cache/ssl_session_boringssl.cc',
        'deps/grpc/src/core/tsi/ssl/session_cache/ssl_session_cache.cc',
        'deps/grpc/src/core/tsi/ssl/session_cache/ssl_session_openssl.cc',
        'deps/grpc/src/core/tsi/ssl_transport_security.cc',
        'deps/grpc/src/core/tsi/transport_security_grpc.cc',
        'deps/grpc/src/core/ext/transport/chttp2/server/chttp2_server.cc',
        'deps/grpc/src/core/ext/transport/chttp2/client/secure/secure_channel_create.cc',
        'deps/grpc/src/core/ext/transport/chttp2/server/insecure/server_chttp2.cc',
        'deps/grpc/src/core/ext/transport/chttp2/server/insecure/server_chttp2_posix.cc',
        'deps/grpc/src/core/ext/transport/inproc/inproc_plugin.cc',
        'deps/grpc/src/core/ext/transport/inproc/inproc_transport.cc',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/grpclb/client_load_reporting_filter.cc',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/grpclb/grpclb.cc',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/grpclb/grpclb_channel_secure.cc',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/grpclb/grpclb_client_stats.cc',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/grpclb/load_balancer_api.cc',
        'deps/grpc/src/core/ext/upb-generated/src/proto/grpc/lb/v1/load_balancer.upb.c',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/fake/fake_resolver.cc',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/xds/xds.cc',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/xds/xds_channel_secure.cc',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/xds/xds_client_stats.cc',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/xds/xds_load_balancer_api.cc',
        'deps/grpc/src/core/ext/upb-generated/envoy/api/v2/auth/cert.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/api/v2/cds.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/api/v2/cluster/circuit_breaker.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/api/v2/cluster/filter.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/api/v2/cluster/outlier_detection.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/api/v2/discovery.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/api/v2/eds.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/api/v2/endpoint/endpoint.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/api/v2/endpoint/load_report.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/service/discovery/v2/ads.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/service/load_stats/v2/lrs.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/api/v2/core/address.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/api/v2/core/base.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/api/v2/core/config_source.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/api/v2/core/grpc_service.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/api/v2/core/health_check.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/api/v2/core/http_uri.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/api/v2/core/protocol.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/type/percent.upb.c',
        'deps/grpc/src/core/ext/upb-generated/envoy/type/range.upb.c',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/pick_first/pick_first.cc',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/round_robin/round_robin.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/c_ares/dns_resolver_ares.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/c_ares/grpc_ares_ev_driver.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/c_ares/grpc_ares_ev_driver_libuv.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/c_ares/grpc_ares_ev_driver_posix.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/c_ares/grpc_ares_ev_driver_windows.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/c_ares/grpc_ares_wrapper.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/c_ares/grpc_ares_wrapper_fallback.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/c_ares/grpc_ares_wrapper_libuv.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/c_ares/grpc_ares_wrapper_posix.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/c_ares/grpc_ares_wrapper_windows.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/dns_resolver_selection.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/native/dns_resolver.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/sockaddr/sockaddr_resolver.cc',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/xds/xds_resolver.cc',
        'deps/grpc/src/core/ext/filters/census/grpc_context.cc',
        'deps/grpc/src/core/ext/filters/client_idle/client_idle_filter.cc',
        'deps/grpc/src/core/ext/filters/max_age/max_age_filter.cc',
        'deps/grpc/src/core/ext/filters/message_size/message_size_filter.cc',
        'deps/grpc/src/core/ext/filters/http/client_authority_filter.cc',
        'deps/grpc/src/core/ext/filters/workarounds/workaround_cronet_compression_filter.cc',
        'deps/grpc/src/core/ext/filters/workarounds/workaround_utils.cc',
        'deps/grpc/src/core/plugin_registry/grpc_plugin_registry.cc',
      ],
      'conditions': [
        ['OS == "mac"', {
          'xcode_settings': {
            'MACOSX_DEPLOYMENT_TARGET': '10.9'
          }
        }]
      ]
    },
    {
      'include_dirs': [
        "<!(node -e \"require('nan')\")"
      ],
      'cflags': [
        '-pthread',
        '-Wno-error=deprecated-declarations',
        '-Wno-cast-function-type'
      ],
      "conditions": [
        ['OS=="win" or runtime=="electron"', {
          'dependencies': [
            "boringssl",
          ]
        }],
        ['OS=="win"', {
          'dependencies': [
            "z",
          ]
        }],
        ['OS=="linux"', {
          'ldflags': [
            '-Wl,-wrap,memcpy'
          ]
        }],
        ['OS == "mac"', {
          'xcode_settings': {
            'MACOSX_DEPLOYMENT_TARGET': '10.9'
          }
        }]
      ],
      "target_name": "grpc_node",
      "sources": [
        "<!@(node -p \"require('fs').readdirSync('./ext').map(f=>'ext/'+f).join(' ')\")"
      ],
      "dependencies": [
        "grpc",
        "gpr",
        "ares",
        "address_sorting"
      ]
    },
    {
      "target_name": "action_after_build",
      "type": "none",
      "dependencies": [ "<(module_name)" ],
      "copies": [
        {
          "files": [ "<(PRODUCT_DIR)/<(module_name).node"],
          "destination": "<(module_path)"
        }
      ]
    }
  ]
}
