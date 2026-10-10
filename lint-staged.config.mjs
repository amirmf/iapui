const config = {
  '*.{js,jsx,ts,tsx,mjs,cjs}': (files) => [
    `prettier --write ${files.join(' ')}`,
    'pnpm lint',
  ],
  '*.{css,scss,json,md,mdx,yml,yaml}': (files) => {
    const sourceFiles = files.filter(
      (file) => !file.startsWith('.agents/skills/')
    )

    return sourceFiles.length > 0
      ? `prettier --write ${sourceFiles.join(' ')}`
      : []
  },
}

export default config
