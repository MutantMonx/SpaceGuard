# Homebrew Formula for SpaceGuard (macOS Disk Space & Dependency Optimizer)
# Created for SpaceGuard v1.2.0

class Spaceguard < Formula
  desc "Disk space optimizer, dependency graph visualizer, and live system audit daemon for macOS & Linux"
  homepage "https://github.com/MutantMonx/SpaceGuard"
  url "https://github.com/MutantMonx/SpaceGuard/archive/refs/tags/v1.2.0.tar.gz"
  sha256 "0000000000000000000000000000000000000000000000000000000000000000" # Placeholder for release tarball
  license "Apache-2.0"
  head "https://github.com/MutantMonx/SpaceGuard.git", branch: "main"

  depends_on "node@20"

  def install
    # Install npm dependencies and build production artifacts
    system "npm", "install", *std_npm_args
    system "npm", "run", "build"

    # Copy distribution files to libexec
    libexec.install "dist", "package.json", "node_modules", "server.ts"

    # Create wrapper launcher in bin/spaceguard
    (bin/"spaceguard").write <<~EOS
      #!/bin/bash
      export NODE_ENV=production
      export PORT=3000
      exec "#{Formula["node@20"].opt_bin}/node" "#{libexec}/dist/server.cjs" "$@"
    EOS

    chmod 0755, bin/"spaceguard"
  end

  def post_install
    # Ensure logs and state directories exist in user home
    (var/"log/spaceguard").mkpath
  end

  service do
    run [opt_bin/"spaceguard"]
    keep_alive true
    working_dir var
    log_path var/"log/spaceguard/stdout.log"
    error_log_path var/"log/spaceguard/stderr.log"
    environment_variables NODE_ENV: "production", PORT: "3000"
  end

  test do
    system "#{bin}/spaceguard", "--version"
  end
end
