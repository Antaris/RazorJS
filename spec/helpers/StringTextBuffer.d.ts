declare class StringTextBuffer
{
  public position: number;
  public length: number;
  constructor(buffer: string);
  read(): string|number;
  peek(): string|number;
  dispose(): void;
  readToEnd(): string;
}