const config = {
  '*.{js,jsx,ts,tsx,mjs,cjs}': (files) => [
    'pnpm lint',
    `prettier --write ${files.join(' ')}`,
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
