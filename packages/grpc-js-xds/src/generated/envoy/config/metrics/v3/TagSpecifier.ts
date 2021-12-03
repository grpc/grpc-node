// Original file: deps/envoy-api/envoy/config/metrics/v3/stats.proto


/**
 * Designates a tag name and value pair. The value may be either a fixed value
 * or a regex providing the value via capture groups. The specified tag will be
 * unconditionally set if a fixed value, otherwise it will only be set if one
 * or more capture groups in the regex match.
 */
export interface TagSpecifier {
  /**
   * Attaches an identifier to the tag values to identify the tag being in the
   * sink. Envoy has a set of default names and regexes to extract dynamic
   * portions of existing stats, which can be found in :repo:`well_known_names.h
   * <source/common/config/well_known_names.h>` in the Envoy repository. If a :ref:`tag_name
   * <envoy_v3_api_field_config.metrics.v3.TagSpecifier.tag_name>` is provided in the config and
   * neither :ref:`regex <envoy_v3_api_field_config.metrics.v3.TagSpecifier.regex>` or
   * :ref:`fixed_value <envoy_v3_api_field_config.metrics.v3.TagSpecifier.fixed_value>` were specified,
   * Envoy will attempt to find that name in its set of defaults and use the accompanying regex.
   * 
   * .. note::
   * 
   * It is invalid to specify the same tag name twice in a config.
   */
  'tag_name'?: (string);
  /**
   * Designates a tag to strip from the tag extracted name and provide as a named
   * tag value for all statistics. This will only occur if any part of the name
   * matches the regex provided with one or more capture groups.
   * 
   * The first capture group identifies the portion of the name to remove. The
   * second capture group (which will normally be nested inside the first) will
   * designate the value of the tag for the statistic. If no second capture
   * group is provided, the first will also be used to set the value of the tag.
   * All other capture groups will be ignored.
   * 
   * Example 1. a stat name ``cluster.foo_cluster.upstream_rq_timeout`` and
   * one tag specifier:
   * 
   * .. code-block:: json
   * 
   * {
   * "tag_name": "envoy.cluster_name",
   * "regex": "^cluster\\.((.+?)\\.)"
   * }
   * 
   * Note that the regex will remove ``foo_cluster.`` making the tag extracted
   * name ``cluster.upstream_rq_timeout`` and the tag value for
   * ``envoy.cluster_name`` will be ``foo_cluster`` (note: there will be no
   * ``.`` character because of the second capture group).
   * 
   * Example 2. a stat name
   * ``http.connection_manager_1.user_agent.ios.downstream_cx_total`` and two
   * tag specifiers:
   * 
   * .. code-block:: json
   * 
   * [
   * {
   * "tag_name": "envoy.http_user_agent",
   * "regex": "^http(?=\\.).*?\\.user_agent\\.((.+?)\\.)\\w+?$"
   * },
   * {
   * "tag_name": "envoy.http_conn_manager_prefix",
   * "regex": "^http\\.((.*?)\\.)"
   * }
   * ]
   * 
   * The two regexes of the specifiers will be processed in the definition order.
   * 
   * The first regex will remove ``ios.``, leaving the tag extracted name
   * ``http.connection_manager_1.user_agent.downstream_cx_total``. The tag
   * ``envoy.http_user_agent`` will be added with tag value ``ios``.
   * 
   * The second regex will remove ``connection_manager_1.`` from the tag
   * extracted name produced by the first regex
   * ``http.connection_manager_1.user_agent.downstream_cx_total``, leaving
   * ``http.user_agent.downstream_cx_total`` as the tag extracted name. The tag
   * ``envoy.http_conn_manager_prefix`` will be added with the tag value
   * ``connection_manager_1``.
   */
  'regex'?: (string);
  /**
   * Specifies a fixed tag value for the ``tag_name``.
   */
  'fixed_value'?: (string);
  'tag_value'?: "regex"|"fixed_value";
}

/**
 * Designates a tag name and value pair. The value may be either a fixed value
 * or a regex providing the value via capture groups. The specified tag will be
 * unconditionally set if a fixed value, otherwise it will only be set if one
 * or more capture groups in the regex match.
 */
export interface TagSpecifier__Output {
  /**
   * Attaches an identifier to the tag values to identify the tag being in the
   * sink. Envoy has a set of default names and regexes to extract dynamic
   * portions of existing stats, which can be found in :repo:`well_known_names.h
   * <source/common/config/well_known_names.h>` in the Envoy repository. If a :ref:`tag_name
   * <envoy_v3_api_field_config.metrics.v3.TagSpecifier.tag_name>` is provided in the config and
   * neither :ref:`regex <envoy_v3_api_field_config.metrics.v3.TagSpecifier.regex>` or
   * :ref:`fixed_value <envoy_v3_api_field_config.metrics.v3.TagSpecifier.fixed_value>` were specified,
   * Envoy will attempt to find that name in its set of defaults and use the accompanying regex.
   * 
   * .. note::
   * 
   * It is invalid to specify the same tag name twice in a config.
   */
  'tag_name': (string);
  /**
   * Designates a tag to strip from the tag extracted name and provide as a named
   * tag value for all statistics. This will only occur if any part of the name
   * matches the regex provided with one or more capture groups.
   * 
   * The first capture group identifies the portion of the name to remove. The
   * second capture group (which will normally be nested inside the first) will
   * designate the value of the tag for the statistic. If no second capture
   * group is provided, the first will also be used to set the value of the tag.
   * All other capture groups will be ignored.
   * 
   * Example 1. a stat name ``cluster.foo_cluster.upstream_rq_timeout`` and
   * one tag specifier:
   * 
   * .. code-block:: json
   * 
   * {
   * "tag_name": "envoy.cluster_name",
   * "regex": "^cluster\\.((.+?)\\.)"
   * }
   * 
   * Note that the regex will remove ``foo_cluster.`` making the tag extracted
   * name ``cluster.upstream_rq_timeout`` and the tag value for
   * ``envoy.cluster_name`` will be ``foo_cluster`` (note: there will be no
   * ``.`` character because of the second capture group).
   * 
   * Example 2. a stat name
   * ``http.connection_manager_1.user_agent.ios.downstream_cx_total`` and two
   * tag specifiers:
   * 
   * .. code-block:: json
   * 
   * [
   * {
   * "tag_name": "envoy.http_user_agent",
   * "regex": "^http(?=\\.).*?\\.user_agent\\.((.+?)\\.)\\w+?$"
   * },
   * {
   * "tag_name": "envoy.http_conn_manager_prefix",
   * "regex": "^http\\.((.*?)\\.)"
   * }
   * ]
   * 
   * The two regexes of the specifiers will be processed in the definition order.
   * 
   * The first regex will remove ``ios.``, leaving the tag extracted name
   * ``http.connection_manager_1.user_agent.downstream_cx_total``. The tag
   * ``envoy.http_user_agent`` will be added with tag value ``ios``.
   * 
   * The second regex will remove ``connection_manager_1.`` from the tag
   * extracted name produced by the first regex
   * ``http.connection_manager_1.user_agent.downstream_cx_total``, leaving
   * ``http.user_agent.downstream_cx_total`` as the tag extracted name. The tag
   * ``envoy.http_conn_manager_prefix`` will be added with the tag value
   * ``connection_manager_1``.
   */
  'regex'?: (string);
  /**
   * Specifies a fixed tag value for the ``tag_name``.
   */
  'fixed_value'?: (string);
  'tag_value': "regex"|"fixed_value";
}
