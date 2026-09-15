// Force mocha to exit after the test run completes.
//
// mocha 3 exited automatically when tests finished. mocha 4+ waits for the
// event loop to drain, so a test that leaks a handle (an open socket, a timer,
// a server still listening) keeps the process alive. In CI this makes the run
// reach the VM wall-clock cap and get killed, even though all tests passed.
//
// mocha searches upward for the nearest rc file, so this single root config
// applies to every package's `gulp test` task.
module.exports = {
  exit: true,
};
