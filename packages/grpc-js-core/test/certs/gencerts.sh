#!/bin/bash

CNAME=${CNAME:-somename}
CERT_PASSPHRASE=${CERT_PASSPHRASE:-somepassphrase}
OUTDIR=${OUTDIR:-.}
DURATION=${DURATION:-3650}
SUBJ=${SUBJ:-/C=US/ST=WA/L=SomeCity/O=SomeOrg/CN=${CNAME}}

tmpdir=$(mktemp -d)

client_ca_filename_base="${CNAME}_ca"
client_ca_key_file="${OUTDIR}/${client_ca_filename_base}.key"
client_ca_cert_file="${OUTDIR}/${client_ca_filename_base}.pem"

main() {
  gen_ca_certs
  gen_client_certs false "${CNAME}_client"
  gen_client_certs true "${CNAME}_usingpassphrase_client"
}

gen_ca_certs() {
  use_cert_passphrase=true
  echo "~~~~~~~~~~ Generating a cert authority (private) key ~~~~~~~~~~"
  pass_args=""
  if [ "${use_cert_passphrase}" = true ] ; then
      pass_args="-passout pass:${CERT_PASSPHRASE}"
  fi
  openssl genrsa -des3 -out ${client_ca_key_file} ${pass_args} 4096

  echo "~~~~~~~~~~ Generating cert authority (public) cert ~~~~~~~~~~"
  pass_args=""
  if [ "${use_cert_passphrase}" = true ] ; then
      pass_args="-passin pass:${CERT_PASSPHRASE}"
  fi
  openssl req -x509 -new -nodes -key ${client_ca_key_file} ${pass_args} -sha256 -days ${DURATION} -out ${client_ca_cert_file} -subj ${SUBJ}
}

gen_client_certs() {
  use_cert_passphrase=$1
  client_filename_base=$2
  client_key_file="${OUTDIR}/${client_filename_base}.key"
  client_cert_csr_file="${OUTDIR}/${client_filename_base}.csr"

  echo "~~~~~~~~~~ Generating client cert (private) key ~~~~~~~~~~"
  pass_args=""
  if [ "${use_cert_passphrase}" = true ] ; then
      pass_args="-des3 -passout pass:${CERT_PASSPHRASE}"
  fi
  openssl genrsa ${pass_args} -out ${client_key_file} 4096

  echo "~~~~~~~~~~ Generating client cert signing request ~~~~~~~~~~"
  pass_args=""
  if [ "${use_cert_passphrase}" = true ] ; then
      pass_args="-passin pass:${CERT_PASSPHRASE}"
  fi
  openssl req -new -key ${client_key_file} ${pass_args} -out ${client_cert_csr_file} -subj ${SUBJ}

  echo "~~~~~~~~~~ Generating client cert creation config extension file ~~~~~~~~~~"
  cat << EOF > ${tmpdir}/v3client.ext
# v3.ext
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
extendedKeyUsage=clientAuth

[alt_names]
DNS.1 = ${CNAME}
DNS.2 = localhost
EOF

  echo "~~~~~~~~~~ Generating client cert ~~~~~~~~~~"
  pass_args="-passin pass:${CERT_PASSPHRASE}"
  openssl x509 -req -days ${DURATION} -in ${client_cert_csr_file} -extfile ${tmpdir}/v3client.ext \
    ${pass_args} -CA ${client_ca_cert_file} -CAkey ${client_ca_key_file} -set_serial 01 \
    -out ${OUTDIR}/${client_filename_base}.pem

  echo "~~~~~~~~~~ Removing unwanted files ~~~~~~~~~~"
  rm -f ${client_cert_csr_file}
  rm -f ${tmpdir}/v3client.ext
}

main
