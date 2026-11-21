<?php

namespace App\Controllers;

use App\Models\Historia;
use Illuminate\Database\Eloquent\Collection;

class InformesController
{
    function informe_por_responsable(string $responsable): Collection
    {
        return Historia::where("responsable", $responsable)->get();
    }

    function informe_general(): array
    {
        $total = Historia::count();
        $finalizadas = Historia::where("estado", "finalizada")->count();
        $pendientes = Historia::where("estado", "nueva")->count()
            + Historia::where("estado", "activa")->count();
        $impedimentos = Historia::where("estado", "impedimento")->count();

        return [
            "total" => $total,
            "finalizadas" => $finalizadas,
            "pendientes" => $pendientes,
            "impedimentos" => $impedimentos,
        ];
    }

    function informe_por_sprint(int $sprint_id): array
    {
        $historias = Historia::where("sprint_id", $sprint_id)->get();
        $total = $historias->count();
        $finalizadas = $historias->where("estado", "finalizada")->count();
        $pendientes = $historias->where("estado", "nueva")->count()
            + $historias->where("estado", "activa")->count();
        $impedimentos = $historias->where("estado", "impedimento")->count();

        return [
            "sprint_id" => $sprint_id,
            "total" => $total,
            "finalizadas" => $finalizadas,
            "pendientes" => $pendientes,
            "impedimentos" => $impedimentos,
        ];
    }
}
