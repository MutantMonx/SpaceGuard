/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { simulator } from './src/utils/debianSimulator.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Get system disk and indicator tray status
  app.get('/api/status', (req, res) => {
    try {
      res.json({
        disk: simulator.getDiskStatus(),
        packagesCount: simulator.getPackages().filter(p => p.status === 'installed').length
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Get full packages list
  app.get('/api/packages', (req, res) => {
    try {
      res.json(simulator.getPackages());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Get a specific package's metadata and connections
  app.get('/api/packages/:name', (req, res) => {
    try {
      const pkg = simulator.getPackage(req.params.name);
      if (!pkg) {
        return res.status(404).json({ error: 'Pakiet nie odnaleziony.' });
      }
      res.json(pkg);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Install a simulated Debian package
  app.post('/api/packages/install', (req, res) => {
    try {
      const { name, installer, hasSudo, method, sourceUrl } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Brak nazwy pakietu.' });
      }
      const success = simulator.installPackage(
        name,
        installer || 'root',
        hasSudo !== undefined ? hasSudo : true,
        method || 'apt',
        sourceUrl || ''
      );
      if (!success) {
        return res.status(400).json({ error: 'Instalacja nie powiodła się.' });
      }
      res.json({ success: true, disk: simulator.getDiskStatus() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Add simulated custom wget/curl/zip file footprint
  app.post('/api/packages/custom', (req, res) => {
    try {
      const { name, sizeMb, url, installer, hasSudo, method, createdFiles, collaboratingWith } = req.body;
      if (!name || !sizeMb) {
        return res.status(400).json({ error: 'Nazwa i rozmiar (MB) są wymagane.' });
      }
      const pkg = simulator.addCustomDownload({
        name,
        sizeMb: parseFloat(sizeMb),
        url: url || `https://custom-dl.org/${name}`,
        installer: installer || 'kali',
        hasSudo: hasSudo !== undefined ? hasSudo : false,
        method: method || 'wget',
        createdFiles,
        collaboratingWith
      });
      res.json({ success: true, pkg, disk: simulator.getDiskStatus() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Remove/Free a simulated package
  app.post('/api/packages/remove', (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Brak nazwy pakietu.' });
      }
      const result = simulator.removePackage(name);
      if (!result.success) {
        return res.status(400).json({ error: result.reason });
      }
      res.json({ success: true, freedMb: result.freedMb, disk: simulator.getDiskStatus() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Run full scan and synchronize metrics
  app.post('/api/scan', (req, res) => {
    try {
      const output = simulator.executeCLI('scan');
      res.json({ output, disk: simulator.getDiskStatus() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Free target space recommendations
  app.get('/api/recommendations', (req, res) => {
    try {
      const targetGb = parseFloat(req.query.target as string || '2.0');
      const recs = simulator.generateRecommendations(targetGb);
      res.json(recs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Wipe system cache and garbage-collect
  app.post('/api/clean', (req, res) => {
    try {
      const output = simulator.executeCLI('clean');
      res.json({ output, disk: simulator.getDiskStatus() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Get Docker and Podman resources
  app.get('/api/containers/resources', (req, res) => {
    try {
      res.json({
        dockerImages: simulator.getDockerImages(),
        dockerContainers: simulator.getDockerContainers(),
        podmanImages: simulator.getPodmanImages(),
        podmanContainers: simulator.getPodmanContainers(),
        disk: simulator.getDiskStatus()
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Remove a resource
  app.post('/api/containers/remove', (req, res) => {
    try {
      const { engine, type, id } = req.body;
      if (!engine || !type || !id) {
        return res.status(400).json({ error: 'engine, type i id są wymagane.' });
      }

      let success = false;
      if (engine === 'docker') {
        if (type === 'image') success = simulator.removeDockerImage(id);
        else if (type === 'container') success = simulator.removeDockerContainer(id);
      } else if (engine === 'podman') {
        if (type === 'image') success = simulator.removePodmanImage(id);
        else if (type === 'container') success = simulator.removePodmanContainer(id);
      }

      if (!success) {
        return res.status(400).json({ error: 'Nie udało się usunąć zasobu.' });
      }

      res.json({ success: true, disk: simulator.getDiskStatus() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Prune an engine
  app.post('/api/containers/prune', (req, res) => {
    try {
      const { engine } = req.body;
      if (!engine) {
        return res.status(400).json({ error: 'engine jest wymagany.' });
      }

      let result;
      if (engine === 'docker') {
        result = simulator.pruneDocker();
      } else if (engine === 'podman') {
        result = simulator.prunePodman();
      } else {
        return res.status(400).json({ error: 'Nieobsługiwany silnik.' });
      }

      res.json({
        success: true,
        freedMb: result.freedMb,
        deletedContainers: result.deletedContainers,
        deletedImages: result.deletedImages,
        disk: simulator.getDiskStatus()
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Execute interactive CLI commands from UI Terminal
  app.post('/api/cli', (req, res) => {
    try {
      const { command } = req.body;
      if (command === undefined) {
        return res.status(400).json({ error: 'Brak polecenia.' });
      }
      const output = simulator.executeCLI(command);
      res.json({ output, disk: simulator.getDiskStatus() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Reset simulated state
  app.post('/api/reset', (req, res) => {
    try {
      simulator.reset();
      res.json({ success: true, disk: simulator.getDiskStatus() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Simulate external background installation / download
  app.post('/api/simulate-external', (req, res) => {
    try {
      const result = simulator.simulateExternalInstallation();
      res.json({ success: true, item: result, disk: simulator.getDiskStatus() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development or Static Assets for production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SpaceGuard Backend Server] running on http://localhost:${PORT}`);
  });
}

startServer();
