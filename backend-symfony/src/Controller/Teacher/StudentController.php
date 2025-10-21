<?php
namespace App\Controller\Teacher;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/teacher/students')]
#[IsGranted('ROLE_TEACHER')]
class StudentController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $repository = $em->getRepository(User::class);
        
        // Récupérer les étudiants avec leurs statistiques
        $query = $em->createQuery("
            SELECT 
                u.id,
                u.username,
                u.email,
                u.course,
                COUNT(e.id) as total_evaluations,
                AVG(e.final_grade) as average_grade,
                MAX(e.submitted_at) as last_evaluation
            FROM App\Entity\User u
            LEFT JOIN App\Entity\ExamSession e WITH u.id = e.student_id AND e.status = 'graded'
            WHERE u.role = 'student'
            GROUP BY u.id
            ORDER BY u.username
        ");
        
        $students = $query->getResult();
        
        // Calculer les statistiques globales
        $statsQuery = $em->createQuery("
            SELECT 
                COUNT(DISTINCT u.id) as total_students,
                COUNT(DISTINCT u.course) as total_courses,
                AVG(student_avg.avg_grade) as global_average
            FROM App\Entity\User u
            LEFT JOIN (
                SELECT 
                    u2.id,
                    AVG(e2.final_grade) as avg_grade
                FROM App\Entity\User u2
                LEFT JOIN App\Entity\ExamSession e2 WITH u2.id = e2.student_id AND e2.status = 'graded'
                WHERE u2.role = 'student'
                GROUP BY u2.id
            ) student_avg ON u.id = student_avg.id
            WHERE u.role = 'student'
        ");
        
        $stats = $statsQuery->getSingleResult();
        
        return $this->json([
            'students' => $students,
            'stats' => $stats
        ]);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(int $id, EntityManagerInterface $em): JsonResponse
    {
        $student = $em->getRepository(User::class)->find($id);
        
        if (!$student || !in_array('ROLE_STUDENT', $student->getRoles(), true)) {
            return $this->json(['error' => 'Étudiant non trouvé'], 404);
        }

        // Récupérer les détails de l'étudiant
        $query = $em->createQuery("
            SELECT 
                u,
                COUNT(e.id) as total_evaluations,
                AVG(e.final_grade) as average_grade,
                COUNT(CASE WHEN e.final_grade >= 10 THEN 1 END) as passed_count,
                COUNT(CASE WHEN e.final_grade < 10 THEN 1 END) as failed_count,
                MAX(e.final_grade) as best_grade,
                MIN(e.final_grade) as worst_grade
            FROM App\Entity\User u
            LEFT JOIN App\Entity\ExamSession e WITH u.id = e.student_id AND e.status = 'graded'
            WHERE u.id = :id
            GROUP BY u.id
        ")->setParameter('id', $id);
        
        $studentDetails = $query->getSingleResult();

        return $this->json($studentDetails);
    }
}