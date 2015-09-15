function StringTextBuffer(buffer)
{
  this.buffer = buffer;
  this.position = 0;
  this.length = this.buffer.length;
}

StringTextBuffer.prototype.read = function () 
{
  if (this.position >= this.buffer.length)
  {
    return -1;
  }
  return this.buffer[this.position++];
};

StringTextBuffer.prototype.peek = function()
{
  if (this.position >= this.buffer.length)
  {
    return -1;
  }
  return this.buffer[this.position];
};

StringTextBuffer.prototype.dispose = function () { };

StringTextBuffer.prototype.readToEnd = function() 
{
  return this.buffer.substr(this.position);  
};

// HACK?
window.StringTextBuffer = StringTextBuffer;