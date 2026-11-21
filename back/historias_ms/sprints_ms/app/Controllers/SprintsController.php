<?php

namespace App\Controllers;

use App\Models\Sprint;
use Exception;
use Illuminate\Database\Eloquent\Collection;

class SprintsController
{
    function get_sprints(): Collection
    {
        return Sprint::all();
    }

    function find_sprint(int $id): Sprint
    {
        return Sprint::findOrFail($id);
    }

    function create(array $data): Sprint
    {
        $sprint = new Sprint();
        $sprint->nombre = $data["nombre"];
        $sprint->fecha_inicio = $data["fecha_inicio"];
        $sprint->fecha_fin = $data["fecha_fin"];
        $sprint->save();
        return $sprint;
    }

    function update(int $id, array $data): Sprint
    {
        $sprint = Sprint::findOrFail($id);
        $sprint->nombre = $data["nombre"];
        $sprint->fecha_inicio = $data["fecha_inicio"];
        $sprint->fecha_fin = $data["fecha_fin"];
        $sprint->save();
        return $sprint;
    }

    function delete(int $id): Sprint
    {
        $sprint = Sprint::findOrFail($id);
        $sprint->delete();
        return $sprint;
    }
}
