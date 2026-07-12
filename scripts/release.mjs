import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('..', import.meta.url))
const packageFiles = [
  'package.json',
  'apps/smap/package.json',
  'packages/smap-sdk/package.json',
]

const versions = packageFiles.map((file) => {
  const packageJson = JSON.parse(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'))
  return { file, version: packageJson.version }
})
const uniqueVersions = new Set(versions.map(item => item.version))

if (uniqueVersions.size !== 1) {
  throw new Error(`Release versions must match:\n${versions.map(item => `${item.file}: ${item.version}`).join('\n')}`)
}

const [version] = uniqueVersions
if (!version || version === '0.0.0')
  throw new Error('Set a real release version before creating a release tag.')

const branch = git(['branch', '--show-current']).trim()
if (branch !== 'main')
  throw new Error(`Releases must be created from main, current branch is ${branch || 'detached HEAD'}.`)

const status = git(['status', '--porcelain']).trim()
if (status)
  throw new Error('Commit all release changes before creating the release tag.')

assertNpmTokenSecret()

const tag = `v${version}`
const existingTag = git(['tag', '--list', tag]).trim()
if (existingTag)
  throw new Error(`${tag} already exists.`)

execFileSync('git', ['tag', '-a', tag, '-m', `chore(release): publish ${tag}`], {
  cwd: rootDir,
  stdio: 'inherit',
})

try {
  execFileSync('git', ['push', 'origin', tag], {
    cwd: rootDir,
    stdio: 'inherit',
  })
}
catch (error) {
  execFileSync('git', ['tag', '--delete', tag], {
    cwd: rootDir,
    stdio: 'inherit',
  })
  throw error
}

function git(args) {
  return execFileSync('git', args, {
    cwd: rootDir,
    encoding: 'utf8',
  })
}

function assertNpmTokenSecret() {
  let secrets

  try {
    const output = execFileSync('gh', ['secret', 'list', '--app', 'actions', '--json', 'name'], {
      cwd: rootDir,
      encoding: 'utf8',
    })
    secrets = JSON.parse(output)
  }
  catch {
    throw new Error('Use an authenticated GitHub CLI before releasing so Actions secrets can be verified.')
  }

  if (!Array.isArray(secrets) || !secrets.some(secret => secret.name === 'NPM_TOKEN')) {
    throw new Error('Configure the NPM_TOKEN GitHub Actions secret before creating a release tag.')
  }
}
