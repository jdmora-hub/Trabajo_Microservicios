<?php

// use Psr\Http\Message\ResponseInterface as Response;
// use Psr\Http\Message\ServerRequestInterface as Request;
use App\Presentation\Repositories\InformeRepository;
use Slim\App;

return function (App $app) {
    
    $app->get('/informes/general', [InformeRepository::class, 'general']);
    $app->get('/informes/sprint/{sprint_id}', [InformeRepository::class, 'por_sprint']);
    $app->get('/informes/responsable/{responsable}', [InformeRepository::class, 'por_responsable']);
};
