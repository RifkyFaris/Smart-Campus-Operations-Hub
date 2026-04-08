package smart.campus.Backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smart.campus.Backend.dto.TicketDto;
import smart.campus.Backend.entity.Resource;
import smart.campus.Backend.entity.Ticket;
import smart.campus.Backend.entity.User;
import smart.campus.Backend.entity.enums.TicketStatus;
import smart.campus.Backend.exception.ResourceNotFoundException;
import smart.campus.Backend.repository.ResourceRepository;
import smart.campus.Backend.repository.TicketRepository;
import smart.campus.Backend.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByReporter(Long reporterId) {
        return ticketRepository.findByReporterId(reporterId);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    public Ticket createTicket(Long reporterId, TicketDto dto) {
        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + dto.getResourceId()));
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + reporterId));

        Ticket ticket = Ticket.builder()
                .resource(resource)
                .reporter(reporter)
                .category(dto.getCategory())
                .priority(dto.getPriority())
                .status(TicketStatus.OPEN)
                .description(dto.getDescription())
                .build();

        return ticketRepository.save(ticket);
    }

    public Ticket updateTicketStatus(Long ticketId, TicketStatus newStatus) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setStatus(newStatus);
        return ticketRepository.save(ticket);
    }

    public Ticket assignTicket(Long ticketId, Long assigneeId) {
        Ticket ticket = getTicketById(ticketId);
        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + assigneeId));
        ticket.setAssignee(assignee);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        return ticketRepository.save(ticket);
    }
}
