import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OtpInput } from "@/components/auth/otp-input";

describe("OtpInput", () => {
  it("nettoie la saisie : majuscules, alphanumérique uniquement, 8 max", () => {
    const onChange = vi.fn();
    render(<OtpInput value="" onChange={onChange} />);

    const input = screen.getByLabelText(/Code de sécurité/);
    fireEvent.change(input, { target: { value: "ab-12!cdef9" } });

    expect(onChange).toHaveBeenCalledWith("AB12CDEF");
  });

  it("accepte le collage et nettoie le contenu", () => {
    const onChange = vi.fn();
    render(<OtpInput value="" onChange={onChange} />);

    const input = screen.getByLabelText(/Code de sécurité/);
    fireEvent.paste(input, {
      clipboardData: { getData: () => "  x9y8 z7w6 " },
    });

    expect(onChange).toHaveBeenCalledWith("X9Y8Z7W6");
  });

  it("affiche un point par case vide et les caractères saisis", () => {
    render(<OtpInput value="AB12" onChange={vi.fn()} />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getAllByText("·")).toHaveLength(4);
  });
});
