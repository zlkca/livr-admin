export const selectTokenId = (state) => (state.auth ? state.auth.tokenId : null);
export const selectSignedInUser = (state) => (state.auth ? state.auth.signedInUser : null);
