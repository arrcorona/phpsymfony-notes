<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;


class UserController extends AbstractController
{
    #[Route('/api/register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $hasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($hasher->hashPassword($user, $data['password']));

        $token = bin2hex(random_bytes(16));
        $user->setConfirmationToken($token);

        $emailsDir = $this->getParameter('kernel.project_dir') . '/var/emails';

        if (!is_dir($emailsDir)) {
            mkdir($emailsDir, 0777, true); // recursive = true
        }

        file_put_contents($emailsDir . '/' . $token . '.txt', "http://localhost:81/api/confirm/$token");

        $em->persist($user);
        $em->flush();

        // Return token so frontend can download
        return new JsonResponse([
            'message' => 'Registered',
            'token' => $token
        ]);
    }

    #[Route('/api/confirm/{token}', methods: ['GET'])]
    public function confirm(string $token, EntityManagerInterface $em): JsonResponse
    {
        $user = $em->getRepository(User::class)->findOneBy(['confirmationToken' => $token]);
        if (!$user) return new JsonResponse(['error' => 'Invalid token'], 404);

        $user->setIsConfirmed(true);
        $user->setConfirmationToken(null);
        $em->flush();

        return new JsonResponse(['message' => 'Account confirmed', 'user' => ['id' => $user->getId(), 'email' => $user->getEmail()]]);
    }

    #[Route('/api/login', methods: ['POST'])]
    public function login(Request $request, JWTTokenManagerInterface $jwtManager, EntityManagerInterface $em, UserPasswordHasherInterface $hasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $user = $em->getRepository(User::class)->findOneBy([
            'email' => $data['email']
        ]);

        if (!$user || !$hasher->isPasswordValid($user, $data['password'])) {
            return new JsonResponse(['error' => 'Invalid credentials'], 401);
        }

        if (!$user->getIsConfirmed()) {
            return new JsonResponse(['error' => 'Account not confirmed'], 403);
        }

        $token = $jwtManager->create($user);

        return new JsonResponse([
            'token' => $token,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'isConfirmed' => $user->getIsConfirmed(),
                'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i:s')
            ]
        ]);
    }

   

    #[Route('/api/download-email/{token}', methods: ['GET'])]
    public function downloadEmail(string $token)
    {
        $file = $this->getParameter('kernel.project_dir') . '/var/emails/' . $token . '.txt';

        if (!file_exists($file)) {
            return new JsonResponse(['error' => 'File not found'], 404);
        }

        return $this->file($file, $token . '.txt', ResponseHeaderBag::DISPOSITION_ATTACHMENT);
    }
}
