<?php

// use Psr\Http\Message\ResponseInterface as Response;
// use Psr\Http\Message\ServerRequestInterface as Request;
use App\Presentation\Repositories\SprintRepository;
use Slim\App;

return function (App $app) {
    
    $app->get('/sprints', [SprintRepository::class, 'all']);
    $app->get('/sprints/{id}', [SprintRepository::class, 'find']);
    $app->post('/sprints', [SprintRepository::class, 'create']);
    $app->put('/sprints/{id}', [SprintRepository::class, 'update']);
    $app->delete('/sprints/{id}', [SprintRepository::class, 'delete']);
};
