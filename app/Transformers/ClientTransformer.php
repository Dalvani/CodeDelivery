<?php

namespace CodeDelivery\Transformers;

use League\Fractal\TransformerAbstract;
use CodeDelivery\Models\Client;

/**
 * Class ClientTransformer
 * @package namespace CodeDelivery\Transformers;
 */
class ClientTransformer extends TransformerAbstract
{

    /**
     * Transform the \Client entity
     * @param \Client $model
     *
     * @return array
     */
    public function transform(Client $model)
    {
        return [
            'id'         => (int) $model->id,

            /* place your other model properties here */

            'created_at' => $model->created_at,
            'updated_at' => $model->updated_at,

            'name' => (string)$model->user->name,
            'email' => (string)$model->user->email,
            'phone' => (string)$model->phone,
            'address' => (string)$model->address,
            'zipcode' => (string)$model->zipcode,
            'city' => (string)$model->city,
            'state' => (string)$model->state
        ];
    }
}
