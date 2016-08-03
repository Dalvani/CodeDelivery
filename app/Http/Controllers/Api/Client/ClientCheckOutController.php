<?php

namespace CodeDelivery\Http\Controllers\Api\Client;

use CodeDelivery\Http\Controllers\Controller;
use CodeDelivery\Http\Requests;
use CodeDelivery\Repositories\OrderRepository;
use CodeDelivery\Repositories\UserRepository;
use CodeDelivery\Services\OrderService;
use Illuminate\Http\Request;
use LucaDegasperi\OAuth2Server\Facades\Authorizer;

class ClientCheckoutController extends Controller
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
        $clientId = $this->userRepository->find($id)->client->id;
        $orders = $this->orderRepository
            ->skipPresenter(false)
            ->with($this->with)
            //->with(['items'])
            ->scopeQuery(function($query) use($clientId) {
            return $query->where('client_id','=',$clientId);
        })->paginate();

        return $orders;

    }

    public function store(Requests\CheckoutRequest $request)
    {
        $id = Authorizer::getResourceOwnerId();
        $data = $request->all();
        $clientId = $this->userRepository->find($id)->client->id;
        $data['client_id'] = $clientId;
        $order = $this->service->create($data);

        //$order = $this->orderRepository->with('items')->find($order->id);

        //return $order;

        return $this->orderRepository
            ->skipPresenter(false)
            ->with($this->with)
            ->find($order->id);
    }

    public function show($id)
    {
        $idUser = Authorizer::getResourceOwnerId();

        //$order = $this->orderRepository->with(['client','items.product','cupom','deliveryman'])->findWhere(['client_id'=>$idUser,'id'=>$id]);

        /*$o->items->each(function($item) {
            $item->product;
        }) ;*/

        //return $order;

        return $this->orderRepository
            ->skipPresenter(false)
            ->with($this->with)
            ->findWhere(['client_id'=>$idUser,'id'=>$id]);
    }

    /*public function authenticated()
    {
        $id = Authorizer::getResourceOwnerId();

        return $this->userRepository->with('client')->find($id);
    }*/
}
