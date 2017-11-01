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
        '-Werror',
        '-Wno-long-long',
        '-Wno-unused-parameter',
        '-DOSATOMIC_USE_INLINED=1',
    ],
    'ldflags': [
        '-g',
    ],
    'cflags_c': [
      '-Werror',
      '-std=c99'
    ],
    'cflags_cc': [
      '-Werror',
      '-std=c++11'
    ],
    'include_dirs': [
      'deps/grpc',
      'deps/grpc/include'
    ],
    'defines': [
      'GPR_BACKWARDS_COMPATIBILITY_MODE',
      'GRPC_ARES=0',
      'GRPC_UV'
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
        ],
      }],
      ['grpc_alpine=="true"', {
        'defines': [
          'GPR_MUSL_LIBC_COMPAT'
        ]
      }],
      ['OS!="win" and runtime=="electron"', {
        "defines": [
          'OPENSSL_NO_THREADS'
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
          "deps/grpc/third_party/zlib",
          "deps/grpc/third_party/cares/cares"
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
          '<(node_root_dir)/deps/zlib',
          '<(node_root_dir)/deps/cares/include'
        ]
      }],
      ['OS == "mac"', {
        'xcode_settings': {
          'OTHER_CFLAGS': [
              '-g',
              '-Wall',
              '-Wextra',
              '-Werror',
              '-Wno-long-long',
              '-Wno-unused-parameter',
              '-DOSATOMIC_USE_INLINED=1',
          ],
          'OTHER_CPLUSPLUSFLAGS': [
              '-g',
              '-Wall',
              '-Wextra',
              '-Werror',
              '-Wno-long-long',
              '-Wno-unused-parameter',
              '-DOSATOMIC_USE_INLINED=1',
            '-stdlib=libc++',
            '-std=c++11',
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
          'dependencies': [
          ],
          'sources': [
            'deps/grpc/src/boringssl/err_data.c',
            'deps/grpc/third_party/boringssl/crypto/aes/aes.c',
            'deps/grpc/third_party/boringssl/crypto/aes/key_wrap.c',
            'deps/grpc/third_party/boringssl/crypto/aes/mode_wrappers.c',
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
            'deps/grpc/third_party/boringssl/crypto/asn1/t_bitst.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/tasn_dec.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/tasn_enc.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/tasn_fre.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/tasn_new.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/tasn_typ.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/tasn_utl.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/time_support.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/x_bignum.c',
            'deps/grpc/third_party/boringssl/crypto/asn1/x_long.c',
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
            'deps/grpc/third_party/boringssl/crypto/bn/add.c',
            'deps/grpc/third_party/boringssl/crypto/bn/asm/x86_64-gcc.c',
            'deps/grpc/third_party/boringssl/crypto/bn/bn.c',
            'deps/grpc/third_party/boringssl/crypto/bn/bn_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/bn/cmp.c',
            'deps/grpc/third_party/boringssl/crypto/bn/convert.c',
            'deps/grpc/third_party/boringssl/crypto/bn/ctx.c',
            'deps/grpc/third_party/boringssl/crypto/bn/div.c',
            'deps/grpc/third_party/boringssl/crypto/bn/exponentiation.c',
            'deps/grpc/third_party/boringssl/crypto/bn/gcd.c',
            'deps/grpc/third_party/boringssl/crypto/bn/generic.c',
            'deps/grpc/third_party/boringssl/crypto/bn/kronecker.c',
            'deps/grpc/third_party/boringssl/crypto/bn/montgomery.c',
            'deps/grpc/third_party/boringssl/crypto/bn/montgomery_inv.c',
            'deps/grpc/third_party/boringssl/crypto/bn/mul.c',
            'deps/grpc/third_party/boringssl/crypto/bn/prime.c',
            'deps/grpc/third_party/boringssl/crypto/bn/random.c',
            'deps/grpc/third_party/boringssl/crypto/bn/rsaz_exp.c',
            'deps/grpc/third_party/boringssl/crypto/bn/shift.c',
            'deps/grpc/third_party/boringssl/crypto/bn/sqrt.c',
            'deps/grpc/third_party/boringssl/crypto/buf/buf.c',
            'deps/grpc/third_party/boringssl/crypto/bytestring/asn1_compat.c',
            'deps/grpc/third_party/boringssl/crypto/bytestring/ber.c',
            'deps/grpc/third_party/boringssl/crypto/bytestring/cbb.c',
            'deps/grpc/third_party/boringssl/crypto/bytestring/cbs.c',
            'deps/grpc/third_party/boringssl/crypto/chacha/chacha.c',
            'deps/grpc/third_party/boringssl/crypto/cipher/aead.c',
            'deps/grpc/third_party/boringssl/crypto/cipher/cipher.c',
            'deps/grpc/third_party/boringssl/crypto/cipher/derive_key.c',
            'deps/grpc/third_party/boringssl/crypto/cipher/e_aes.c',
            'deps/grpc/third_party/boringssl/crypto/cipher/e_chacha20poly1305.c',
            'deps/grpc/third_party/boringssl/crypto/cipher/e_des.c',
            'deps/grpc/third_party/boringssl/crypto/cipher/e_null.c',
            'deps/grpc/third_party/boringssl/crypto/cipher/e_rc2.c',
            'deps/grpc/third_party/boringssl/crypto/cipher/e_rc4.c',
            'deps/grpc/third_party/boringssl/crypto/cipher/e_ssl3.c',
            'deps/grpc/third_party/boringssl/crypto/cipher/e_tls.c',
            'deps/grpc/third_party/boringssl/crypto/cipher/tls_cbc.c',
            'deps/grpc/third_party/boringssl/crypto/cmac/cmac.c',
            'deps/grpc/third_party/boringssl/crypto/conf/conf.c',
            'deps/grpc/third_party/boringssl/crypto/cpu-aarch64-linux.c',
            'deps/grpc/third_party/boringssl/crypto/cpu-arm-linux.c',
            'deps/grpc/third_party/boringssl/crypto/cpu-arm.c',
            'deps/grpc/third_party/boringssl/crypto/cpu-intel.c',
            'deps/grpc/third_party/boringssl/crypto/cpu-ppc64le.c',
            'deps/grpc/third_party/boringssl/crypto/crypto.c',
            'deps/grpc/third_party/boringssl/crypto/curve25519/curve25519.c',
            'deps/grpc/third_party/boringssl/crypto/curve25519/spake25519.c',
            'deps/grpc/third_party/boringssl/crypto/curve25519/x25519-x86_64.c',
            'deps/grpc/third_party/boringssl/crypto/des/des.c',
            'deps/grpc/third_party/boringssl/crypto/dh/check.c',
            'deps/grpc/third_party/boringssl/crypto/dh/dh.c',
            'deps/grpc/third_party/boringssl/crypto/dh/dh_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/dh/params.c',
            'deps/grpc/third_party/boringssl/crypto/digest/digest.c',
            'deps/grpc/third_party/boringssl/crypto/digest/digests.c',
            'deps/grpc/third_party/boringssl/crypto/dsa/dsa.c',
            'deps/grpc/third_party/boringssl/crypto/dsa/dsa_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/ec/ec.c',
            'deps/grpc/third_party/boringssl/crypto/ec/ec_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/ec/ec_key.c',
            'deps/grpc/third_party/boringssl/crypto/ec/ec_montgomery.c',
            'deps/grpc/third_party/boringssl/crypto/ec/oct.c',
            'deps/grpc/third_party/boringssl/crypto/ec/p224-64.c',
            'deps/grpc/third_party/boringssl/crypto/ec/p256-64.c',
            'deps/grpc/third_party/boringssl/crypto/ec/p256-x86_64.c',
            'deps/grpc/third_party/boringssl/crypto/ec/simple.c',
            'deps/grpc/third_party/boringssl/crypto/ec/util-64.c',
            'deps/grpc/third_party/boringssl/crypto/ec/wnaf.c',
            'deps/grpc/third_party/boringssl/crypto/ecdh/ecdh.c',
            'deps/grpc/third_party/boringssl/crypto/ecdsa/ecdsa.c',
            'deps/grpc/third_party/boringssl/crypto/ecdsa/ecdsa_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/engine/engine.c',
            'deps/grpc/third_party/boringssl/crypto/err/err.c',
            'deps/grpc/third_party/boringssl/crypto/evp/digestsign.c',
            'deps/grpc/third_party/boringssl/crypto/evp/evp.c',
            'deps/grpc/third_party/boringssl/crypto/evp/evp_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/evp/evp_ctx.c',
            'deps/grpc/third_party/boringssl/crypto/evp/p_dsa_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/evp/p_ec.c',
            'deps/grpc/third_party/boringssl/crypto/evp/p_ec_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/evp/p_rsa.c',
            'deps/grpc/third_party/boringssl/crypto/evp/p_rsa_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/evp/pbkdf.c',
            'deps/grpc/third_party/boringssl/crypto/evp/print.c',
            'deps/grpc/third_party/boringssl/crypto/evp/sign.c',
            'deps/grpc/third_party/boringssl/crypto/ex_data.c',
            'deps/grpc/third_party/boringssl/crypto/hkdf/hkdf.c',
            'deps/grpc/third_party/boringssl/crypto/hmac/hmac.c',
            'deps/grpc/third_party/boringssl/crypto/lhash/lhash.c',
            'deps/grpc/third_party/boringssl/crypto/md4/md4.c',
            'deps/grpc/third_party/boringssl/crypto/md5/md5.c',
            'deps/grpc/third_party/boringssl/crypto/mem.c',
            'deps/grpc/third_party/boringssl/crypto/modes/cbc.c',
            'deps/grpc/third_party/boringssl/crypto/modes/cfb.c',
            'deps/grpc/third_party/boringssl/crypto/modes/ctr.c',
            'deps/grpc/third_party/boringssl/crypto/modes/gcm.c',
            'deps/grpc/third_party/boringssl/crypto/modes/ofb.c',
            'deps/grpc/third_party/boringssl/crypto/modes/polyval.c',
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
            'deps/grpc/third_party/boringssl/crypto/pkcs8/p5_pbev2.c',
            'deps/grpc/third_party/boringssl/crypto/pkcs8/p8_pkey.c',
            'deps/grpc/third_party/boringssl/crypto/pkcs8/pkcs8.c',
            'deps/grpc/third_party/boringssl/crypto/poly1305/poly1305.c',
            'deps/grpc/third_party/boringssl/crypto/poly1305/poly1305_arm.c',
            'deps/grpc/third_party/boringssl/crypto/poly1305/poly1305_vec.c',
            'deps/grpc/third_party/boringssl/crypto/pool/pool.c',
            'deps/grpc/third_party/boringssl/crypto/rand/deterministic.c',
            'deps/grpc/third_party/boringssl/crypto/rand/fuchsia.c',
            'deps/grpc/third_party/boringssl/crypto/rand/rand.c',
            'deps/grpc/third_party/boringssl/crypto/rand/urandom.c',
            'deps/grpc/third_party/boringssl/crypto/rand/windows.c',
            'deps/grpc/third_party/boringssl/crypto/rc4/rc4.c',
            'deps/grpc/third_party/boringssl/crypto/refcount_c11.c',
            'deps/grpc/third_party/boringssl/crypto/refcount_lock.c',
            'deps/grpc/third_party/boringssl/crypto/rsa/blinding.c',
            'deps/grpc/third_party/boringssl/crypto/rsa/padding.c',
            'deps/grpc/third_party/boringssl/crypto/rsa/rsa.c',
            'deps/grpc/third_party/boringssl/crypto/rsa/rsa_asn1.c',
            'deps/grpc/third_party/boringssl/crypto/rsa/rsa_impl.c',
            'deps/grpc/third_party/boringssl/crypto/sha/sha1-altivec.c',
            'deps/grpc/third_party/boringssl/crypto/sha/sha1.c',
            'deps/grpc/third_party/boringssl/crypto/sha/sha256.c',
            'deps/grpc/third_party/boringssl/crypto/sha/sha512.c',
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
            'deps/grpc/third_party/boringssl/crypto/x509/pkcs7.c',
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
            'deps/grpc/third_party/boringssl/crypto/x509/x509type.c',
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
            'deps/grpc/third_party/boringssl/ssl/bio_ssl.c',
            'deps/grpc/third_party/boringssl/ssl/custom_extensions.c',
            'deps/grpc/third_party/boringssl/ssl/d1_both.c',
            'deps/grpc/third_party/boringssl/ssl/d1_lib.c',
            'deps/grpc/third_party/boringssl/ssl/d1_pkt.c',
            'deps/grpc/third_party/boringssl/ssl/d1_srtp.c',
            'deps/grpc/third_party/boringssl/ssl/dtls_method.c',
            'deps/grpc/third_party/boringssl/ssl/dtls_record.c',
            'deps/grpc/third_party/boringssl/ssl/handshake_client.c',
            'deps/grpc/third_party/boringssl/ssl/handshake_server.c',
            'deps/grpc/third_party/boringssl/ssl/s3_both.c',
            'deps/grpc/third_party/boringssl/ssl/s3_lib.c',
            'deps/grpc/third_party/boringssl/ssl/s3_pkt.c',
            'deps/grpc/third_party/boringssl/ssl/ssl_aead_ctx.c',
            'deps/grpc/third_party/boringssl/ssl/ssl_asn1.c',
            'deps/grpc/third_party/boringssl/ssl/ssl_buffer.c',
            'deps/grpc/third_party/boringssl/ssl/ssl_cert.c',
            'deps/grpc/third_party/boringssl/ssl/ssl_cipher.c',
            'deps/grpc/third_party/boringssl/ssl/ssl_ecdh.c',
            'deps/grpc/third_party/boringssl/ssl/ssl_file.c',
            'deps/grpc/third_party/boringssl/ssl/ssl_lib.c',
            'deps/grpc/third_party/boringssl/ssl/ssl_privkey.c',
            'deps/grpc/third_party/boringssl/ssl/ssl_privkey_cc.cc',
            'deps/grpc/third_party/boringssl/ssl/ssl_session.c',
            'deps/grpc/third_party/boringssl/ssl/ssl_stat.c',
            'deps/grpc/third_party/boringssl/ssl/ssl_transcript.c',
            'deps/grpc/third_party/boringssl/ssl/ssl_x509.c',
            'deps/grpc/third_party/boringssl/ssl/t1_enc.c',
            'deps/grpc/third_party/boringssl/ssl/t1_lib.c',
            'deps/grpc/third_party/boringssl/ssl/tls13_both.c',
            'deps/grpc/third_party/boringssl/ssl/tls13_client.c',
            'deps/grpc/third_party/boringssl/ssl/tls13_enc.c',
            'deps/grpc/third_party/boringssl/ssl/tls13_server.c',
            'deps/grpc/third_party/boringssl/ssl/tls_method.c',
            'deps/grpc/third_party/boringssl/ssl/tls_record.c',
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
      'target_name': 'gpr',
      'product_prefix': 'lib',
      'type': 'static_library',
      'dependencies': [
      ],
      'sources': [
        'deps/grpc/src/core/lib/profiling/basic_timers.c',
        'deps/grpc/src/core/lib/profiling/stap_timers.c',
        'deps/grpc/src/core/lib/support/alloc.c',
        'deps/grpc/src/core/lib/support/arena.c',
        'deps/grpc/src/core/lib/support/atm.c',
        'deps/grpc/src/core/lib/support/avl.c',
        'deps/grpc/src/core/lib/support/backoff.c',
        'deps/grpc/src/core/lib/support/cmdline.c',
        'deps/grpc/src/core/lib/support/cpu_iphone.c',
        'deps/grpc/src/core/lib/support/cpu_linux.c',
        'deps/grpc/src/core/lib/support/cpu_posix.c',
        'deps/grpc/src/core/lib/support/cpu_windows.c',
        'deps/grpc/src/core/lib/support/env_linux.c',
        'deps/grpc/src/core/lib/support/env_posix.c',
        'deps/grpc/src/core/lib/support/env_windows.c',
        'deps/grpc/src/core/lib/support/fork.c',
        'deps/grpc/src/core/lib/support/histogram.c',
        'deps/grpc/src/core/lib/support/host_port.c',
        'deps/grpc/src/core/lib/support/log.c',
        'deps/grpc/src/core/lib/support/log_android.c',
        'deps/grpc/src/core/lib/support/log_linux.c',
        'deps/grpc/src/core/lib/support/log_posix.c',
        'deps/grpc/src/core/lib/support/log_windows.c',
        'deps/grpc/src/core/lib/support/mpscq.c',
        'deps/grpc/src/core/lib/support/murmur_hash.c',
        'deps/grpc/src/core/lib/support/stack_lockfree.c',
        'deps/grpc/src/core/lib/support/string.c',
        'deps/grpc/src/core/lib/support/string_posix.c',
        'deps/grpc/src/core/lib/support/string_util_windows.c',
        'deps/grpc/src/core/lib/support/string_windows.c',
        'deps/grpc/src/core/lib/support/subprocess_posix.c',
        'deps/grpc/src/core/lib/support/subprocess_windows.c',
        'deps/grpc/src/core/lib/support/sync.c',
        'deps/grpc/src/core/lib/support/sync_posix.c',
        'deps/grpc/src/core/lib/support/sync_windows.c',
        'deps/grpc/src/core/lib/support/thd.c',
        'deps/grpc/src/core/lib/support/thd_posix.c',
        'deps/grpc/src/core/lib/support/thd_windows.c',
        'deps/grpc/src/core/lib/support/time.c',
        'deps/grpc/src/core/lib/support/time_posix.c',
        'deps/grpc/src/core/lib/support/time_precise.c',
        'deps/grpc/src/core/lib/support/time_windows.c',
        'deps/grpc/src/core/lib/support/tls_pthread.c',
        'deps/grpc/src/core/lib/support/tmpfile_msys.c',
        'deps/grpc/src/core/lib/support/tmpfile_posix.c',
        'deps/grpc/src/core/lib/support/tmpfile_windows.c',
        'deps/grpc/src/core/lib/support/wrap_memcpy.c',
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
        'deps/grpc/src/core/lib/surface/init.c',
        'deps/grpc/src/core/lib/channel/channel_args.c',
        'deps/grpc/src/core/lib/channel/channel_stack.c',
        'deps/grpc/src/core/lib/channel/channel_stack_builder.c',
        'deps/grpc/src/core/lib/channel/connected_channel.c',
        'deps/grpc/src/core/lib/channel/handshaker.c',
        'deps/grpc/src/core/lib/channel/handshaker_factory.c',
        'deps/grpc/src/core/lib/channel/handshaker_registry.c',
        'deps/grpc/src/core/lib/compression/compression.c',
        'deps/grpc/src/core/lib/compression/message_compress.c',
        'deps/grpc/src/core/lib/compression/stream_compression.c',
        'deps/grpc/src/core/lib/compression/stream_compression_gzip.c',
        'deps/grpc/src/core/lib/compression/stream_compression_identity.c',
        'deps/grpc/src/core/lib/debug/stats.c',
        'deps/grpc/src/core/lib/debug/stats_data.c',
        'deps/grpc/src/core/lib/http/format_request.c',
        'deps/grpc/src/core/lib/http/httpcli.c',
        'deps/grpc/src/core/lib/http/parser.c',
        'deps/grpc/src/core/lib/iomgr/call_combiner.c',
        'deps/grpc/src/core/lib/iomgr/closure.c',
        'deps/grpc/src/core/lib/iomgr/combiner.c',
        'deps/grpc/src/core/lib/iomgr/endpoint.c',
        'deps/grpc/src/core/lib/iomgr/endpoint_pair_posix.c',
        'deps/grpc/src/core/lib/iomgr/endpoint_pair_uv.c',
        'deps/grpc/src/core/lib/iomgr/endpoint_pair_windows.c',
        'deps/grpc/src/core/lib/iomgr/error.c',
        'deps/grpc/src/core/lib/iomgr/ev_epoll1_linux.c',
        'deps/grpc/src/core/lib/iomgr/ev_epollex_linux.c',
        'deps/grpc/src/core/lib/iomgr/ev_epollsig_linux.c',
        'deps/grpc/src/core/lib/iomgr/ev_poll_posix.c',
        'deps/grpc/src/core/lib/iomgr/ev_posix.c',
        'deps/grpc/src/core/lib/iomgr/ev_windows.c',
        'deps/grpc/src/core/lib/iomgr/exec_ctx.c',
        'deps/grpc/src/core/lib/iomgr/executor.c',
        'deps/grpc/src/core/lib/iomgr/fork_posix.c',
        'deps/grpc/src/core/lib/iomgr/fork_windows.c',
        'deps/grpc/src/core/lib/iomgr/gethostname_fallback.c',
        'deps/grpc/src/core/lib/iomgr/gethostname_host_name_max.c',
        'deps/grpc/src/core/lib/iomgr/gethostname_sysconf.c',
        'deps/grpc/src/core/lib/iomgr/iocp_windows.c',
        'deps/grpc/src/core/lib/iomgr/iomgr.c',
        'deps/grpc/src/core/lib/iomgr/iomgr_posix.c',
        'deps/grpc/src/core/lib/iomgr/iomgr_uv.c',
        'deps/grpc/src/core/lib/iomgr/iomgr_windows.c',
        'deps/grpc/src/core/lib/iomgr/is_epollexclusive_available.c',
        'deps/grpc/src/core/lib/iomgr/load_file.c',
        'deps/grpc/src/core/lib/iomgr/lockfree_event.c',
        'deps/grpc/src/core/lib/iomgr/network_status_tracker.c',
        'deps/grpc/src/core/lib/iomgr/polling_entity.c',
        'deps/grpc/src/core/lib/iomgr/pollset_set_uv.c',
        'deps/grpc/src/core/lib/iomgr/pollset_set_windows.c',
        'deps/grpc/src/core/lib/iomgr/pollset_uv.c',
        'deps/grpc/src/core/lib/iomgr/pollset_windows.c',
        'deps/grpc/src/core/lib/iomgr/resolve_address_posix.c',
        'deps/grpc/src/core/lib/iomgr/resolve_address_uv.c',
        'deps/grpc/src/core/lib/iomgr/resolve_address_windows.c',
        'deps/grpc/src/core/lib/iomgr/resource_quota.c',
        'deps/grpc/src/core/lib/iomgr/sockaddr_utils.c',
        'deps/grpc/src/core/lib/iomgr/socket_factory_posix.c',
        'deps/grpc/src/core/lib/iomgr/socket_mutator.c',
        'deps/grpc/src/core/lib/iomgr/socket_utils_common_posix.c',
        'deps/grpc/src/core/lib/iomgr/socket_utils_linux.c',
        'deps/grpc/src/core/lib/iomgr/socket_utils_posix.c',
        'deps/grpc/src/core/lib/iomgr/socket_utils_uv.c',
        'deps/grpc/src/core/lib/iomgr/socket_utils_windows.c',
        'deps/grpc/src/core/lib/iomgr/socket_windows.c',
        'deps/grpc/src/core/lib/iomgr/tcp_client_posix.c',
        'deps/grpc/src/core/lib/iomgr/tcp_client_uv.c',
        'deps/grpc/src/core/lib/iomgr/tcp_client_windows.c',
        'deps/grpc/src/core/lib/iomgr/tcp_posix.c',
        'deps/grpc/src/core/lib/iomgr/tcp_server_posix.c',
        'deps/grpc/src/core/lib/iomgr/tcp_server_utils_posix_common.c',
        'deps/grpc/src/core/lib/iomgr/tcp_server_utils_posix_ifaddrs.c',
        'deps/grpc/src/core/lib/iomgr/tcp_server_utils_posix_noifaddrs.c',
        'deps/grpc/src/core/lib/iomgr/tcp_server_uv.c',
        'deps/grpc/src/core/lib/iomgr/tcp_server_windows.c',
        'deps/grpc/src/core/lib/iomgr/tcp_uv.c',
        'deps/grpc/src/core/lib/iomgr/tcp_windows.c',
        'deps/grpc/src/core/lib/iomgr/time_averaged_stats.c',
        'deps/grpc/src/core/lib/iomgr/timer_generic.c',
        'deps/grpc/src/core/lib/iomgr/timer_heap.c',
        'deps/grpc/src/core/lib/iomgr/timer_manager.c',
        'deps/grpc/src/core/lib/iomgr/timer_uv.c',
        'deps/grpc/src/core/lib/iomgr/udp_server.c',
        'deps/grpc/src/core/lib/iomgr/unix_sockets_posix.c',
        'deps/grpc/src/core/lib/iomgr/unix_sockets_posix_noop.c',
        'deps/grpc/src/core/lib/iomgr/wakeup_fd_cv.c',
        'deps/grpc/src/core/lib/iomgr/wakeup_fd_eventfd.c',
        'deps/grpc/src/core/lib/iomgr/wakeup_fd_nospecial.c',
        'deps/grpc/src/core/lib/iomgr/wakeup_fd_pipe.c',
        'deps/grpc/src/core/lib/iomgr/wakeup_fd_posix.c',
        'deps/grpc/src/core/lib/json/json.c',
        'deps/grpc/src/core/lib/json/json_reader.c',
        'deps/grpc/src/core/lib/json/json_string.c',
        'deps/grpc/src/core/lib/json/json_writer.c',
        'deps/grpc/src/core/lib/slice/b64.c',
        'deps/grpc/src/core/lib/slice/percent_encoding.c',
        'deps/grpc/src/core/lib/slice/slice.c',
        'deps/grpc/src/core/lib/slice/slice_buffer.c',
        'deps/grpc/src/core/lib/slice/slice_hash_table.c',
        'deps/grpc/src/core/lib/slice/slice_intern.c',
        'deps/grpc/src/core/lib/slice/slice_string_helpers.c',
        'deps/grpc/src/core/lib/surface/alarm.c',
        'deps/grpc/src/core/lib/surface/api_trace.c',
        'deps/grpc/src/core/lib/surface/byte_buffer.c',
        'deps/grpc/src/core/lib/surface/byte_buffer_reader.c',
        'deps/grpc/src/core/lib/surface/call.c',
        'deps/grpc/src/core/lib/surface/call_details.c',
        'deps/grpc/src/core/lib/surface/call_log_batch.c',
        'deps/grpc/src/core/lib/surface/channel.c',
        'deps/grpc/src/core/lib/surface/channel_init.c',
        'deps/grpc/src/core/lib/surface/channel_ping.c',
        'deps/grpc/src/core/lib/surface/channel_stack_type.c',
        'deps/grpc/src/core/lib/surface/completion_queue.c',
        'deps/grpc/src/core/lib/surface/completion_queue_factory.c',
        'deps/grpc/src/core/lib/surface/event_string.c',
        'deps/grpc/src/core/lib/surface/lame_client.cc',
        'deps/grpc/src/core/lib/surface/metadata_array.c',
        'deps/grpc/src/core/lib/surface/server.c',
        'deps/grpc/src/core/lib/surface/validate_metadata.c',
        'deps/grpc/src/core/lib/surface/version.c',
        'deps/grpc/src/core/lib/transport/bdp_estimator.c',
        'deps/grpc/src/core/lib/transport/byte_stream.c',
        'deps/grpc/src/core/lib/transport/connectivity_state.c',
        'deps/grpc/src/core/lib/transport/error_utils.c',
        'deps/grpc/src/core/lib/transport/metadata.c',
        'deps/grpc/src/core/lib/transport/metadata_batch.c',
        'deps/grpc/src/core/lib/transport/pid_controller.c',
        'deps/grpc/src/core/lib/transport/service_config.c',
        'deps/grpc/src/core/lib/transport/static_metadata.c',
        'deps/grpc/src/core/lib/transport/status_conversion.c',
        'deps/grpc/src/core/lib/transport/timeout_encoding.c',
        'deps/grpc/src/core/lib/transport/transport.c',
        'deps/grpc/src/core/lib/transport/transport_op_string.c',
        'deps/grpc/src/core/lib/debug/trace.c',
        'deps/grpc/src/core/ext/transport/chttp2/server/secure/server_secure_chttp2.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/bin_decoder.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/bin_encoder.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/chttp2_plugin.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/chttp2_transport.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/flow_control.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/frame_data.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/frame_goaway.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/frame_ping.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/frame_rst_stream.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/frame_settings.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/frame_window_update.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/hpack_encoder.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/hpack_parser.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/hpack_table.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/http2_settings.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/huffsyms.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/incoming_metadata.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/parsing.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/stream_lists.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/stream_map.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/varint.c',
        'deps/grpc/src/core/ext/transport/chttp2/transport/writing.c',
        'deps/grpc/src/core/ext/transport/chttp2/alpn/alpn.c',
        'deps/grpc/src/core/ext/filters/http/client/http_client_filter.c',
        'deps/grpc/src/core/ext/filters/http/http_filters_plugin.c',
        'deps/grpc/src/core/ext/filters/http/message_compress/message_compress_filter.c',
        'deps/grpc/src/core/ext/filters/http/server/http_server_filter.c',
        'deps/grpc/src/core/lib/http/httpcli_security_connector.c',
        'deps/grpc/src/core/lib/security/context/security_context.c',
        'deps/grpc/src/core/lib/security/credentials/composite/composite_credentials.c',
        'deps/grpc/src/core/lib/security/credentials/credentials.c',
        'deps/grpc/src/core/lib/security/credentials/credentials_metadata.c',
        'deps/grpc/src/core/lib/security/credentials/fake/fake_credentials.c',
        'deps/grpc/src/core/lib/security/credentials/google_default/credentials_generic.c',
        'deps/grpc/src/core/lib/security/credentials/google_default/google_default_credentials.c',
        'deps/grpc/src/core/lib/security/credentials/iam/iam_credentials.c',
        'deps/grpc/src/core/lib/security/credentials/jwt/json_token.c',
        'deps/grpc/src/core/lib/security/credentials/jwt/jwt_credentials.c',
        'deps/grpc/src/core/lib/security/credentials/jwt/jwt_verifier.c',
        'deps/grpc/src/core/lib/security/credentials/oauth2/oauth2_credentials.c',
        'deps/grpc/src/core/lib/security/credentials/plugin/plugin_credentials.c',
        'deps/grpc/src/core/lib/security/credentials/ssl/ssl_credentials.c',
        'deps/grpc/src/core/lib/security/transport/client_auth_filter.c',
        'deps/grpc/src/core/lib/security/transport/lb_targets_info.c',
        'deps/grpc/src/core/lib/security/transport/secure_endpoint.c',
        'deps/grpc/src/core/lib/security/transport/security_connector.c',
        'deps/grpc/src/core/lib/security/transport/security_handshaker.c',
        'deps/grpc/src/core/lib/security/transport/server_auth_filter.c',
        'deps/grpc/src/core/lib/security/transport/tsi_error.c',
        'deps/grpc/src/core/lib/security/util/json_util.c',
        'deps/grpc/src/core/lib/surface/init_secure.c',
        'deps/grpc/src/core/tsi/fake_transport_security.c',
        'deps/grpc/src/core/tsi/gts_transport_security.c',
        'deps/grpc/src/core/tsi/ssl_transport_security.c',
        'deps/grpc/src/core/tsi/transport_security_grpc.c',
        'deps/grpc/src/core/tsi/transport_security.c',
        'deps/grpc/src/core/tsi/transport_security_adapter.c',
        'deps/grpc/src/core/ext/transport/chttp2/server/chttp2_server.c',
        'deps/grpc/src/core/ext/transport/chttp2/client/secure/secure_channel_create.c',
        'deps/grpc/src/core/ext/filters/client_channel/channel_connectivity.c',
        'deps/grpc/src/core/ext/filters/client_channel/client_channel.c',
        'deps/grpc/src/core/ext/filters/client_channel/client_channel_factory.c',
        'deps/grpc/src/core/ext/filters/client_channel/client_channel_plugin.c',
        'deps/grpc/src/core/ext/filters/client_channel/connector.c',
        'deps/grpc/src/core/ext/filters/client_channel/http_connect_handshaker.c',
        'deps/grpc/src/core/ext/filters/client_channel/http_proxy.c',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy.c',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy_factory.c',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy_registry.c',
        'deps/grpc/src/core/ext/filters/client_channel/parse_address.c',
        'deps/grpc/src/core/ext/filters/client_channel/proxy_mapper.c',
        'deps/grpc/src/core/ext/filters/client_channel/proxy_mapper_registry.c',
        'deps/grpc/src/core/ext/filters/client_channel/resolver.c',
        'deps/grpc/src/core/ext/filters/client_channel/resolver_factory.c',
        'deps/grpc/src/core/ext/filters/client_channel/resolver_registry.c',
        'deps/grpc/src/core/ext/filters/client_channel/retry_throttle.c',
        'deps/grpc/src/core/ext/filters/client_channel/subchannel.c',
        'deps/grpc/src/core/ext/filters/client_channel/subchannel_index.c',
        'deps/grpc/src/core/ext/filters/client_channel/uri_parser.c',
        'deps/grpc/src/core/ext/filters/deadline/deadline_filter.c',
        'deps/grpc/src/core/ext/transport/chttp2/client/chttp2_connector.c',
        'deps/grpc/src/core/ext/transport/chttp2/server/insecure/server_chttp2.c',
        'deps/grpc/src/core/ext/transport/chttp2/server/insecure/server_chttp2_posix.c',
        'deps/grpc/src/core/ext/transport/chttp2/client/insecure/channel_create.c',
        'deps/grpc/src/core/ext/transport/chttp2/client/insecure/channel_create_posix.c',
        'deps/grpc/src/core/ext/transport/inproc/inproc_plugin.c',
        'deps/grpc/src/core/ext/transport/inproc/inproc_transport.c',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/grpclb/client_load_reporting_filter.c',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/grpclb/grpclb.c',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/grpclb/grpclb_channel_secure.c',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/grpclb/grpclb_client_stats.c',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/grpclb/load_balancer_api.c',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/grpclb/proto/grpc/lb/v1/load_balancer.pb.c',
        'deps/grpc/third_party/nanopb/pb_common.c',
        'deps/grpc/third_party/nanopb/pb_decode.c',
        'deps/grpc/third_party/nanopb/pb_encode.c',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/fake/fake_resolver.c',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/pick_first/pick_first.c',
        'deps/grpc/src/core/ext/filters/client_channel/lb_policy/round_robin/round_robin.c',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/c_ares/dns_resolver_ares.c',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/c_ares/grpc_ares_ev_driver_posix.c',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/c_ares/grpc_ares_wrapper.c',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/c_ares/grpc_ares_wrapper_fallback.c',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/dns/native/dns_resolver.c',
        'deps/grpc/src/core/ext/filters/client_channel/resolver/sockaddr/sockaddr_resolver.c',
        'deps/grpc/src/core/ext/filters/load_reporting/server_load_reporting_filter.c',
        'deps/grpc/src/core/ext/filters/load_reporting/server_load_reporting_plugin.c',
        'deps/grpc/src/core/ext/census/base_resources.c',
        'deps/grpc/src/core/ext/census/context.c',
        'deps/grpc/src/core/ext/census/gen/census.pb.c',
        'deps/grpc/src/core/ext/census/gen/trace_context.pb.c',
        'deps/grpc/src/core/ext/census/grpc_context.c',
        'deps/grpc/src/core/ext/census/grpc_filter.c',
        'deps/grpc/src/core/ext/census/grpc_plugin.c',
        'deps/grpc/src/core/ext/census/initialize.c',
        'deps/grpc/src/core/ext/census/intrusive_hash_map.c',
        'deps/grpc/src/core/ext/census/mlog.c',
        'deps/grpc/src/core/ext/census/operation.c',
        'deps/grpc/src/core/ext/census/placeholders.c',
        'deps/grpc/src/core/ext/census/resource.c',
        'deps/grpc/src/core/ext/census/trace_context.c',
        'deps/grpc/src/core/ext/census/tracing.c',
        'deps/grpc/src/core/ext/filters/max_age/max_age_filter.c',
        'deps/grpc/src/core/ext/filters/message_size/message_size_filter.c',
        'deps/grpc/src/core/ext/filters/workarounds/workaround_cronet_compression_filter.c',
        'deps/grpc/src/core/ext/filters/workarounds/workaround_utils.c',
        'deps/grpc/src/core/plugin_registry/grpc_plugin_registry.c',
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
        '-zdefs',
        '-Wno-error=deprecated-declarations'
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
        "ext/byte_buffer.cc",
        "ext/call.cc",
        "ext/call_credentials.cc",
        "ext/channel.cc",
        "ext/channel_credentials.cc",
        "ext/completion_queue.cc",
        "ext/node_grpc.cc",
        "ext/server.cc",
        "ext/server_credentials.cc",
        "ext/slice.cc",
        "ext/timeval.cc",
      ],
      "dependencies": [
        "grpc",
        "gpr",
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
