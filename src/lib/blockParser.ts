import { CustomBlock } from './types';

const BLOCK_REGEX = /\{\{block\s+([^}]+)\}\}/g; // Regex to find {{block ...}}

export const parseBlocks = (content: string): { text: string; blocks: CustomBlock[] } => {
  const blocks: CustomBlock[] = [];
  let parsedContent = content;

  const placeholders: string[] = [];

  parsedContent = parsedContent.replace(BLOCK_REGEX, (match, attributesString, offset) => {
    const attrs: { [key: string]: string | string[] } = {};
    // Regex to extract key="value" pairs
    const attrRegex = /(\w+)\s*=\s*(["'])(.*?)\2/g; 

    let matchAttr;
    while ((matchAttr = attrRegex.exec(attributesString)) !== null) {
      const key = matchAttr[1];
      let value = matchAttr[3];

      if (key === 'products') {
        attrs[key] = value.split(',').map(item => item.trim());
      } else {
        attrs[key] = value;
      }
    }

    if (!attrs.name || typeof attrs.name !== 'string') {
      throw new Error('Block must have a name property');
    }

    const block: CustomBlock = {
      name: attrs.name,
      ...attrs
    };
    blocks.push(block);

    const placeholder = `__BLOCK_PLACEHOLDER_${blocks.length - 1}__`;
    placeholders.push(placeholder);
    return placeholder;
  });

  return { text: parsedContent, blocks };
};