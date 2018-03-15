export interface EmitterAugmentation0<Name extends string|symbol> {
  addListener(event: Name, listener: () => void): this;
  emit(event: Name): boolean;
  on(event: Name, listener: () => void): this;
  once(event: Name, listener: () => void): this;
  prependListener(event: Name, listener: () => void): this;
  prependOnceListener(event: Name, listener: () => void): this;
  removeListener(event: Name, listener: () => void): this;
}

export interface EmitterAugmentation1<Name extends string|symbol, Arg> {
  addListener(event: Name, listener: (arg1: Arg) => void): this;
  emit(event: Name, arg1: Arg): boolean;
  on(event: Name, listener: (arg1: Arg) => void): this;
  once(event: Name, listener: (arg1: Arg) => void): this;
  prependListener(event: Name, listener: (arg1: Arg) => void): this;
  prependOnceListener(event: Name, listener: (arg1: Arg) => void): this;
  removeListener(event: Name, listener: (arg1: Arg) => void): this;
}

export interface EmitterAugmentation2<Name extends string|symbol, Arg1, Arg2> {
  addListener(event: Name, listener: (arg1: Arg1, arg2: Arg2) => void): this;
  emit(event: Name, arg1: Arg1, arg2: Arg2): boolean;
  on(event: Name, listener: (arg1: Arg1, arg2: Arg2) => void): this;
  once(event: Name, listener: (arg1: Arg1, arg2: Arg2) => void): this;
  prependListener(event: Name, listener: (arg1: Arg1, arg2: Arg2) => void): this;
  prependOnceListener(event: Name, listener: (arg1: Arg1, arg2: Arg2) => void): this;
  removeListener(event: Name, listener: (arg1: Arg1, arg2: Arg2) => void): this;
}
