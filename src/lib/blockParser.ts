import { CustomBlock } from './types';

const BLOCK_REGEX = /\{\{block\s+([^}]+)\}\}/g; // Regex to find {{block ...}}

export const parseBlocks = (content: string): { text: string; blocks: CustomBlock[] } => {
  const blocks: CustomBlock[] = [];
  let parsedContent = content;

  // Use a temporary placeholder to avoid issues with nested replacements
  const placeholders: string[] = [];

  parsedContent = parsedContent.replace(BLOCK_REGEX, (match, attributesString, offset) => {
    const attrs: { [key: string]: string | string[] } = {};
    // Regex to extract key="value" pairs
    const attrRegex = /(\w+)\s*=\s*(["'])(.*?)\2/g; // Matches key="value" or key='value'

    let matchAttr;
    while ((matchAttr = attrRegex.exec(attributesString)) !== null) {
      const key = matchAttr[1];
      let value = matchAttr[3];

      // Handle comma-separated lists for 'products' attribute
      if (key === 'products') {
        attrs[key] = value.split(',').map(item => item.trim());
      } else {
        attrs[key] = value;
      }
    }

    // Ensure required properties are present
    if (!attrs.name || typeof attrs.name !== 'string') {
      throw new Error('Block must have a name property');
    }

    const block: CustomBlock = {
      name: attrs.name,
      ...attrs
    };
    blocks.push(block);

    // Replace the block tag with a unique placeholder
    const placeholder = `__BLOCK_PLACEHOLDER_${blocks.length - 1}__`;
    placeholders.push(placeholder);
    return placeholder;
  });

  return { text: parsedContent, blocks };
};