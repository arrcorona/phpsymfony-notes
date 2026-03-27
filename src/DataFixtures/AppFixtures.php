<?php

namespace App\DataFixtures;

use App\Entity\Note;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $users = [];

        for ($i = 1; $i <= 2; $i++) {
            $user = new User();
            $user->setEmail("admin$i@test.com");

            $hashedPassword = $this->passwordHasher->hashPassword(
                $user,
                'password'
            );

            $user->setPassword($hashedPassword);
            $user->setIsConfirmed(true);
            $manager->persist($user);
            $users[] = $user;
        }

        for ($i = 1; $i <= 10; $i++) {
            $note = new Note();
            $note->setTitle("Title Dummy $i");
            $note->setContent("$i - Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur possimus molestiae cumque hic sunt odio distinctio neque incidunt in mollitia. Soluta possimus adipisci doloribus repellendus, consequatur saepe voluptatum ea, sint, ipsa obcaecati pariatur veritatis accusantium magni voluptate alias dolore cumque.");
            $note->setStatus(['new', 'todo', 'done'][array_rand(['new', 'todo', 'done'])]);
            $note->setCategory('general');
            $note->setUser($users[array_rand($users)]);

            $manager->persist($note);
        }

        $manager->flush();
    }
}
