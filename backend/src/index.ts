import { Hono } from 'hono'
import { CodeSandbox, VMTier } from "@codesandbox/sdk";
import { cors } from 'hono/cors'
const app = new Hono()
const sdk = new CodeSandbox();
app.use(cors({
  origin: '*'
}))

app.get('/', async (c) => {
  return c.text('Hello World')
});

// Create a blank sandbox and return editor URL
app.post('/create', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));

    const sandbox = await sdk.sandboxes.create({
      id: 'pt_UAK1CM7xJ2Wi4UGs4dufjy', // This should be a template ID for blank project
      title: body.title || 'New Sandbox',
      description: body.description || 'Blank sandbox environment',
      tags: body.tags || ['blank'],
      privacy: 'public-hosts',
      vmTier: VMTier.Micro,
      hibernationTimeoutSeconds: 300,
      automaticWakeupConfig: {
        http: true,
        websocket: false
      }
    });

    return c.json({
      success: true,
      id: sandbox.id,
      editorUrl: `https://codesandbox.io/p/sandbox/${sandbox.id}`,
      previewUrl: `https://${sandbox.id}.csb.app/`,
      message: 'Sandbox created! Open the editorUrl to start coding.'
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to create sandbox' }, 500);
  }
});

// Create with initial files
app.post('/create-with-files', async (c) => {
  try {
    const { title, description, files } = await c.req.json();

    const sandbox = await sdk.sandboxes.create({
      id: 'pt_UAK1CM7xJ2Wi4UGs4dufjy',
      title: title || 'New Sandbox',
      description: description || 'Sandbox with initial files',
      tags: ['custom'],
      privacy: 'public-hosts',
      vmTier: VMTier.Micro,
      hibernationTimeoutSeconds: 300,
      automaticWakeupConfig: {
        http: true,
        websocket: false
      }
    });

    // If files are provided, write them to the sandbox
    if (files && Array.isArray(files)) {
      for (const file of files) {
        await sdk.sandboxes.fs.writeFile(sandbox.id, file.path, file.content);
      }
    }

    return c.json({
      success: true,
      id: sandbox.id,
      editorUrl: `https://codesandbox.io/p/sandbox/${sandbox.id}`,
      previewUrl: `https://${sandbox.id}.csb.app/`,
      filesCreated: files?.length || 0
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to create sandbox with files' }, 500);
  }
});

// Upload file to existing sandbox
app.post('/sandboxes/:id/files', async (c) => {
  try {
    const id = c.req.param('id');
    const { path, content } = await c.req.json();

    await sdk.sandboxes.fs.writeFile(id, path, content);

    return c.json({
      success: true,
      message: 'File uploaded successfully',
      path
    });
  } catch (error) {
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// Install package in sandbox
app.post('/sandboxes/:id/install', async (c) => {
  try {
    const id = c.req.param('id');
    const { package: packageName } = await c.req.json();

    // Execute npm install command in the sandbox
    const result = await sdk.sandboxes.terminal.execute(id, `npm install ${packageName}`);

    return c.json({
      success: true,
      message: `Package ${packageName} installed`,
      output: result
    });
  } catch (error) {
    return c.json({ error: 'Failed to install package' }, 500);
  }
});

// Run command in sandbox
app.post('/sandboxes/:id/run', async (c) => {
  try {
    const id = c.req.param('id');
    const { command } = await c.req.json();

    const result = await sdk.sandboxes.terminal.execute(id, command);

    return c.json({
      success: true,
      output: result
    });
  } catch (error) {
    return c.json({ error: 'Failed to run command' }, 500);
  }
});

// List all sandboxes
app.get('/sandboxes', async (c) => {
  try {
    const sandboxes = await sdk.sandboxes.list();
    console.log(sandboxes.sandboxes);

    const sandboxList = sandboxes.sandboxes?.map(sandbox => ({
      id: sandbox.id,
      title: sandbox.title || 'Untitled',
      description: sandbox.description,
      tags: sandbox.tags,
      editorUrl: `https://codesandbox.io/p/sandbox/${sandbox.id}`,
      previewUrl: `https://${sandbox.id}.csb.app/`,
      createdAt: sandbox.createdAt,
      updatedAt: sandbox.updatedAt
    }));

    return c.json({
      total: sandboxList.length,
      sandboxes: sandboxList
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch sandboxes' }, 500);
  }
});

// Get a specific sandbox by ID
app.get('/sandboxes/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const sandbox = await sdk.sandboxes.get(id);

    return c.json({
      id: sandbox.id,
      title: sandbox.title,
      description: sandbox.description,
      tags: sandbox.tags,
      privacy: sandbox.privacy,
      editorUrl: `https://codesandbox.io/p/sandbox/${sandbox.id}`,
      previewUrl: `https://${sandbox.id}.csb.app/`,
      createdAt: sandbox.createdAt,
      updatedAt: sandbox.updatedAt
    });
  } catch (error) {
    return c.json({ error: 'Sandbox not found' }, 404);
  }
});

// Delete a sandbox
app.delete('/sandboxes/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await sdk.sandboxes.delete(id);
    return c.json({ message: 'Sandbox deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete sandbox' }, 500);
  }
});

//create a session 
app.get('/sessions/:id', async (c) => {
  try {
    const sandboxId = c.req.param('id');
    const sandbox = await sdk.sandboxes.resume(sandboxId)
    const session = await sandbox.createSession();

    return c.json({ session });
  } catch (error) {
    return c.json({ error: 'Failed to create session' }, 500);
  }
});

export default app;