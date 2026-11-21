<?php

namespace App\Presentation\Repositories;

use App\Controllers\InformesController;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class InformeRepository
{

    public function general(Request $request, Response $response, $args): Response
    {
        $controller = new InformesController();
        $data = $controller->informe_general();
        $response->getBody()->write(json_encode($data));
        return $response->withHeader("Content-Type", "application/json");
    }

    public function por_sprint(Request $request, Response $response, $args): Response
    {
        $sprint_id = $args['sprint_id'];
        $controller = new InformesController();
        $data = $controller->informe_por_sprint($sprint_id);
        $response->getBody()->write(json_encode($data));
        return $response->withHeader("Content-Type", "application/json");
    }

    public function por_responsable(Request $request, Response $response, $args): Response
    {
        $responsable = $args['responsable'];
        $controller = new InformesController();
        $rows = $controller->informe_por_responsable($responsable);
        $response->getBody()->write($rows->toJson());
        return $response->withHeader("Content-Type", "application/json");
    }
}
