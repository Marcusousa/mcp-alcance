import { Build } from '@stencil/core';

export default function testAttributes(attributes: string): {} {
  let result = {};
  if (Build.isDev || Build.isTesting) {
    attributes.split(' ').forEach((attr: string) => result[attr] = true);
  }
  return result;
}