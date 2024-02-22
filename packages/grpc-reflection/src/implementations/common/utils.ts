/** Gets the package scope for a type name
 *
 * @example scope('grpc.reflection.v1.Type') == 'grpc.reflection.v1'
 */
export const scope = (path: string, separator: string = '.') => {
  if (!path.includes(separator) || path === separator) {
    return '';
  }

  return path.split(separator).slice(0, -1).join(separator) || separator;
};
