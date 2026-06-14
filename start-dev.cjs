const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting MERN Job Portal...\n');

// Start Backend
console.log('📦 Starting Backend Server...');
const backend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'backend'),
    shell: true,
    stdio: 'inherit'
});

// Wait a bit before starting frontend
setTimeout(() => {
    console.log('\n🎨 Starting Frontend Server...');
    const frontend = spawn('npm', ['run', 'client'], {
        shell: true,
        stdio: 'inherit'
    });

    frontend.on('error', (err) => {
        console.error('❌ Frontend Error:', err);
    });
}, 2000);

backend.on('error', (err) => {
    console.error('❌ Backend Error:', err);
});

// Handle exit
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down servers...');
    backend.kill();
    process.exit();
});

console.log('\n✅ Servers starting...');
console.log('📍 Backend will run on: http://localhost:5000');
console.log('📍 Frontend will run on: http://localhost:5173 (or next available port)');
console.log('\n💡 Press Ctrl+C to stop both servers\n');
