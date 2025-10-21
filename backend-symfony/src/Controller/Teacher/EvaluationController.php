<?php
namespace App\Controller\Teacher;

use App\Entity\ExamTheme;
use App\Entity\Course;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/teacher/evaluations')]
#[IsGranted('ROLE_TEACHER')]
class EvaluationController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $repository = $em->getRepository(ExamTheme::class);
        $evaluations = $repository->findBy(['teacher' => $this->getUser()]);
        
        $data = [];
        foreach ($evaluations as $evaluation) {
            $data[] = [
                'id' => $evaluation->getId(),
                'title' => $evaluation->getTitle(),
                'category' => $evaluation->getCategory(),
                'duration_minutes' => $evaluation->getDurationMinutes(),
                'status' => $evaluation->getStatus(),
                'created_at' => $evaluation->getCreatedAt()->format('Y-m-d H:i:s'),
                'course_name' => $evaluation->getCourse()?->getCourseName()
            ];
        }
        
        return $this->json($data);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $examTheme = new ExamTheme();
        $examTheme->setTitle($data['title']);
        $examTheme->setCategory($data['category']);
        $examTheme->setDurationMinutes($data['duration_minutes']);
        $examTheme->setQuestions($data['questions'] ?? []);
        $examTheme->setStatus($data['status'] ?? 'draft');
        $examTheme->setTeacher($this->getUser());
        
        if (isset($data['course_id'])) {
            $course = $em->getRepository(Course::class)->find($data['course_id']);
            $examTheme->setCourse($course);
        }

        $em->persist($examTheme);
        $em->flush();

        return $this->json([
            'id' => $examTheme->getId(),
            'title' => $examTheme->getTitle(),
            'status' => $examTheme->getStatus()
        ], 201);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(ExamTheme $evaluation): JsonResponse
    {
        // Vérifier que l'évaluation appartient à l'enseignant
        if ($evaluation->getTeacher() !== $this->getUser()) {
            return $this->json(['error' => 'Accès non autorisé'], 403);
        }

        return $this->json([
            'id' => $evaluation->getId(),
            'title' => $evaluation->getTitle(),
            'category' => $evaluation->getCategory(),
            'duration_minutes' => $evaluation->getDurationMinutes(),
            'questions' => $evaluation->getQuestions(),
            'status' => $evaluation->getStatus(),
            'created_at' => $evaluation->getCreatedAt()->format('Y-m-d H:i:s')
        ]);
    }
#[Route('/create', methods: ['POST'])]
public function createEvaluation(Request $request, EntityManagerInterface $em): JsonResponse
{
    $data = json_decode($request->getContent(), true);
    
    // Validation des données
    if (!isset($data['title']) || empty(trim($data['title']))) {
        return $this->json(['error' => 'Le titre est obligatoire'], 400);
    }

    if (!isset($data['questions']) || empty($data['questions'])) {
        return $this->json(['error' => 'Au moins une question est requise'], 400);
    }

    $examTheme = new ExamTheme();
    $examTheme->setTitle(trim($data['title']));
    $examTheme->setCategory($data['category'] ?? 'scientifique');
    $examTheme->setDurationMinutes($data['duration_minutes'] ?? 60);
    $examTheme->setQuestions($data['questions']);
    $examTheme->setStatus('draft');
    $examTheme->setTeacher($this->getUser());
    
    if (isset($data['course_id']) && !empty($data['course_id'])) {
        $course = $em->getRepository(Course::class)->find($data['course_id']);
        if ($course) {
            $examTheme->setCourse($course);
        }
    }

    try {
        $em->persist($examTheme);
        $em->flush();

        return $this->json([
            'id' => $examTheme->getId(),
            'title' => $examTheme->getTitle(),
            'status' => $examTheme->getStatus(),
            'message' => 'Épreuve créée avec succès'
        ], 201);
        
    } catch (\Exception $e) {
        return $this->json(['error' => 'Erreur lors de la création: ' . $e->getMessage()], 500);
    }
}
}