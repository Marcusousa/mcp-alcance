export default argTypes => {

  let args = {};

  Object.keys(argTypes).forEach(name => {
    args[name] = eval(argTypes[name]?.table?.defaultValue?.summary);
  });

  return args;
}
