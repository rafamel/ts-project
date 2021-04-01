module.exports = function typescript() {
  return {
    extends: './tsconfig.json',
    include: ['./src/**/*'],
    compilerOptions: {
      declaration: true,
      emitDeclarationOnly: true
    }
  };
};
