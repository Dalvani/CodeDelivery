<?php

namespace CodeDelivery\Transformers;

use Illuminate\Database\Eloquent\Collection;
use League\Fractal\TransformerAbstract;
use CodeDelivery\Models\Order;

/**
 * Class OrderTransformer
 * @package namespace CodeDelivery\Transformers;
 */
class OrderTransformer extends TransformerAbstract
{
    // Informa os metodos que são padraoes na hora de serializar
    //protected $defaultIncludes = ['cupom','items','client', 'deliveryman'];

    //Não vão ser serializados por padrão somente por requisição
    //é necessario passar como parametro de url todos os includes necessarios
    protected  $availableIncludes = ['cupom','items','client', 'deliveryman'];

    /**
     * Transform the \Order entity
     * @param \Order $model
     *
     * @return array
     */
    public function transform(Order $model)
    {
        return [
            'id'         => (int) $model->id,
            'total'      => (float) $model->total,
            'status'     => $model->status,
            'product_names' => $this->getArrayProductNames($model->items),
            'hash'       => $model->hash,

            /* place your other model properties here */

            'created' => $model->created_at
            //'updated_at' => $model->updated_at
        ];
    }

    protected function getArrayProductNames(Collection $items)
    {
        $names = [];
        foreach($items as $item) {
            $names[] = $item->product->name;
        }
        return $names;
    }

    public function includeClient(Order $model)
    {
        return $this->item($model->client, new ClientTransformer());
    }

    // Muitos pra Um
    public function includeCupom(Order $model)
    {
        if(!$model->cupom) {
            return null;
        }
        return $this->item($model->cupom, new CupomTransformer());
    }

    // Um pra Muitos
    public function includeItems(Order $model)
    {
        return $this->collection($model->items, new OrderItemTransformer());
    }

    public function includeDeliveryman(Order $model)
    {
        if(!$model->deliveryman) {
            return null;
        }
        return $this->item($model->deliveryman, new DeliverymanTransformer());
    }
}
