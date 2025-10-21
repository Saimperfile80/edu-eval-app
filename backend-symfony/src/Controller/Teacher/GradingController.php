<?php
namespace App\Controller\Teacher;

use App\Entity\ExamSession;
use App\Entity\ExamTheme;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/teacher/grading')]
#[IsGranted('ROLE_TEACHER')]
class GradingController extends AbstractController
{
    #[Route('/sessions', methods: ['GET'])]
    public function getSessionsToGrade(EntityManagerInterface $em): JsonResponse
    {
        $teacher = $this->getUser();
        
        $query = $em->createQuery("
            SELECT 
                es.id,
                es.answers,
                es.submitted_at,
                es.status,
                student.username as student_name,
                student.email as student_email,
                et.id as exam_theme_id,
                et.title as exam_title,
                et.questions,
                c.course_name
            FROM App\Entity\ExamSession es
            JOIN es.examTheme et
            JOIN es.student student
            LEFT JOIN et.course c
            WHERE et.teacher = :teacher 
            AND es.status = 'submitted'
            ORDER BY es.submitted_at DESC
        ")->setParameter('teacher', $teacher);
        
        $sessions = $query->getResult();
        
        return $this->json($sessions);
    }

    #[Route('/session/{id}', methods: ['GET'])]
    public function getSessionDetails(int $id, EntityManagerInterface $em): JsonResponse
    {
        $session = $em->getRepository(ExamSession::class)->find($id);
        
        if (!$session) {
            return $this->json(['error' => 'Session non trouvée'], 404);
        }

        // Vérifier que l'épreuve appartient à l'enseignant
        if ($session->getExamTheme()->getTeacher() !== $this->getUser()) {
            return $this->json(['error' => 'Accès non autorisé'], 403);
        }

        return $this->json([
            'session' => $session,
            'exam_theme' => $session->getExamTheme(),
            'student' => $session->getStudent()
        ]);
    }

    #[Route('/session/{id}/grade', methods: ['POST'])]
    public function submitGrade(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $session = $em->getRepository(ExamSession::class)->find($id);
        
        if (!$session) {
            return $this->json(['error' => 'Session non trouvée'], 404);
        }

        // Vérifier les permissions
        if ($session->getExamTheme()->getTeacher() !== $this->getUser()) {
            return $this->json(['error' => 'Accès non autorisé'], 403);
        }

        $data = json_decode($request->getContent(), true);
        
        $session->setFinalGrade($data['final_grade']);
        $session->setTeacherComments($data['teacher_comments'] ?? '');
        $session->setMention($data['mention'] ?? '');
        $session->setStatus('graded');
        $session->setGradedAt(new \DateTime());

        // Sauvegarder le détail des notes (dans une table dédiée si nécessaire)
        // ...

        $em->flush();

        return $this->json([
            'message' => 'Correction enregistrée avec succès',
            'final_grade' => $session->getFinalGrade(),
            'mention' => $session->getMention()
        ]);
    }
}