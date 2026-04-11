/**
 * Procedural placeholder art generator.
 * Creates simple colored backgrounds and shapes as Phaser textures
 * so the game is playable without external image assets.
 */
export function generatePlaceholderArt(scene) {
  // We use Phaser's built-in graphics for all visuals,
  // drawn directly in each scene. No pre-generated textures needed
  // for Phase 1 — each scene draws its own procedural background.
  //
  // This function is a hook for when we add pre-rendered image assets later.
  // For now, all art is inline in the scene draw functions.
}
