/**
 * @description 容器类型
 * @export
 * @enum {number}
 */
export enum ContainerType {
  INLINE_CONTAINER = 4,
  FLOW_CONTAINER,
  BLOCK_CONTAINER
}

/**
 * @description 精灵容器类型
 * @export
 * @enum {number}
 */
export enum SpiritType {
  DEFAULT,
  ABSOLUTE,
  FIXED,
  FLEX_CONTAINER,
  INLINE_CONTAINER,
  FLOW_CONTAINER,
  BLOCK_CONTAINER
}

/**
 * @description 屏幕编辑模式
 * @export
 * @enum {number}
 */
export enum EditMode {
  DEFAULT = "default",
  FIXED = "fixed"
}
