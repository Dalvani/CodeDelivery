<?php

namespace CodeDelivery\Http\Controllers\Api\Deliveryman;

use CodeDelivery\Events\GetLocationDeliveryman;
use CodeDelivery\Http\Controllers\Controller;
use CodeDelivery\Http\Requests;
use CodeDelivery\Models\Geo;
use CodeDelivery\Repositories\OrderRepository;
use CodeDelivery\Repositories\UserRepository;
use CodeDelivery\Services\OrderService;
use Illuminate\Http\Request;
use LucaDegasperi\OAuth2Server\Facades\Authorizer;

class DeliverymanCheckoutController extends Controller
{
    private $orderRepository;
    private $userRepository;
    private $service;
    private $with = ['client','items.product','cupom','deliveryman'];

    public function __construct(
        OrderRepository $orderRepository,
        UserRepository $userRepository,
        OrderService $service)
    {
        $this->orderRepository = $orderRepository;
        $this->userRepository = $userRepository;
        $this->service = $service;
    }

    public function index()
    {
        $id = Authorizer::getResourceOwnerId();
        $orders = $this->orderRepository
            ->skipPresenter(false)
            ->with($this->with)
            ->scopeQuery(function($query) use($id) {
            return $query->where('user_deliveryman_id','=',$id);
        })->paginate();

        return $orders;

    }

    public function show($id)
    {
        $idDeliveryman = Authorizer::getResourceOwnerId();

        return $this->orderRepository
            ->skipPresenter(false)
            ->getByIdAndDeliveryman($id, $idDeliveryman);
    }

    public function updateStatus(Request $request, $id)
    {
        $idDeliveryman = Authorizer::getResourceOwnerId();
        return $this->service->updateStatus($id, $idDeliveryman, $request->get('status'));

        /*$order = $this->service->updateStatus($id, $idDeliveryman, $request->get('status'));

        if($order) {
            //return $order;
            return $this->orderRepository->find($order->id);
        }

        abort(400, "Order não encontrado");
        */
    }

    public function authenticated()
    {
        $id = Authorizer::getResourceOwnerId();

        return $this->userRepository->with('client')->find($id);
    }

    public function geo(Request $request, Geo $geo, $id)
    {
        $idDeliveryman = Authorizer::getResourceOwnerId();
        $order = $this->orderRepository->getByIdAndDeliveryman($id, $idDeliveryman);
        $geo->latitude = $request->get('latitude');
        $geo->longitude = $request->get('longitude');
        event(new GetLocationDeliveryman($geo,$order));
        return $geo;
    }
}
