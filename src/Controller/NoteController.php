<?php

namespace App\Controller;

use App\Entity\Note;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/notes')]
class NoteController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function list(Request $request, EntityManagerInterface $em): JsonResponse
    {

        $user = $this->getUser();
        if (!$user) return new JsonResponse(['error' => 'Unauthorized'], 401);

        $search = $request->query->get('search');
        $status = $request->query->get('status');
        $category = $request->query->get('category');

        $qb = $em->getRepository(Note::class)->createQueryBuilder('n')
            ->andWhere('n.user = :user')
            ->setParameter('user', $user);

        if ($search) {
            $qb->andWhere('n.title LIKE :s OR n.content LIKE :s')
                ->setParameter('s', "%$search%");
        }
        if ($status) $qb->andWhere('n.status = :st')->setParameter('st', $status);
        if ($category) $qb->andWhere('n.category = :c')->setParameter('c', $category);

        $notes = $qb->getQuery()->getResult();

        $result = array_map(fn($n) => [
            'id' => $n->getId(),
            'title' => $n->getTitle(),
            'content' => $n->getContent(),
            'category' => $n->getCategory(),
            'status' => $n->getStatus(),
            'createdAt' => $n->getCreatedAt()->format('Y-m-d H:i:s'),
            'updatedAt' => $n->getUpdatedAt()?->format('Y-m-d H:i:s'),
        ], $notes);

        return new JsonResponse($result);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $note = new Note();
        $note->setTitle($data['title']);
        $note->setContent($data['content'] ?? null);
        $note->setCategory($data['category'] ?? null);
        $note->setStatus($data['status'] ?? 'new');


        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }
        $note->setUser($user);

        $em->persist($note);
        $em->flush();

        return $this->json($note, 201);
    }

    //sensio/framework-extra-bundle
    #[Route('/{id}', methods: ['GET'])]
    public function show(Note $note): JsonResponse
    {
        return $this->json($note);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(Note $note, Request $request, EntityManagerInterface $em): JsonResponse
    {

        if ($note->getUser() !== $this->getUser()) return new JsonResponse(['error' => 'Forbidden'], 403);

        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) $note->setTitle($data['title']);
        if (array_key_exists('content', $data)) $note->setContent($data['content']);
        if (array_key_exists('category', $data)) $note->setCategory($data['category']);
        if (isset($data['status'])) $note->setStatus($data['status']);

        $note->setUpdatedAt(new \DateTimeImmutable());

        $em->flush();

        return $this->json($note);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(Note $note, EntityManagerInterface $em): JsonResponse
    {

        if ($note->getUser() !== $this->getUser()) return new JsonResponse(['error' => 'Forbidden'], 403);

        $em->remove($note);
        $em->flush();

        return $this->json(['message' => 'Deleted']);
    }
}
