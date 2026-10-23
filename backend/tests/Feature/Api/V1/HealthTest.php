<?php

namespace Tests\Feature\Api\V1;

use Tests\TestCase;

class HealthTest extends TestCase
{
    public function test_health_endpoint_returns_the_versioned_service_status(): void
    {
        $response = $this->getJson('/api/v1/health');

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.service', 'investormart-api')
            ->assertJsonPath('data.status', 'ok')
            ->assertJsonPath('data.version', 'v1')
            ->assertJsonStructure(['data' => ['timestamp']]);
    }
}
