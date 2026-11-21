<?php

// use Psr\Http\Message\ResponseInterface as Response;
// use Psr\Http\Message\ServerRequestInterface as Request;
use App\Presentation\Repositories\HistoriaRepository;
use Slim\App;

return function (App $app) {
    
    $app->get('/historias', [HistoriaRepository::class, 'all']);
    $app->get('/historias/{id}', [HistoriaRepository::class, 'find']);
    $app->get('/historias/sprint/{sprint_id}', [HistoriaRepository::class, 'by_sprint']);
    $app->post('/historias', [HistoriaRepository::class, 'create']);
    $app->put('/historias/{id}', [HistoriaRepository::class, 'update']);
    $app->delete('/historias/{id}', [HistoriaRepository::class, 'delete']);
};
