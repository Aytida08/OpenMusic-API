class ExportsHandler {
    constructor(service, validator, playlistsService) {
        this._service = service;
        this._validator = validator;
        this._playlistsService = playlistsService;

        this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
    }

    async postExportPlaylistHandler(request, h) {
        this._validator.validateExportPlaylistsPayload(request.payload);
            
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        await this._playlistsService.verifyPlaylistExist(playlistId);

        const message = {
            userId: request.auth.credentials.id,
            playlistId,
            targetEmail: request.payload.targetEmail,
        };
        await this._service.sendMessage('export:playlists', JSON.stringify(message));

        const response = h.response({
            status: 'success',
            message: 'Sedang di proses',
        });
        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;